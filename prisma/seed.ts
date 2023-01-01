import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import { promises as fs } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const legal_types = [{ name: 'SICAV' }, { name: 'FCP' }]
const categories = [
  { name: 'Actions' },
  { name: 'OMLT' },
  { name: 'Monétaire' },
  { name: 'Diversifié' },
  { name: 'OCT' },
  { name: 'Contractuel' },
]
const periodicities = [{ name: 'daily' }, { name: 'weekly' }]

interface Fund {
  'Dénomination OPCVM': string
  'CODE ISIN': string
  'Code Maroclear': string
  'Société de Gestion': string
  'Nature juridique': string
  Classification: string
  'Périodicité VL': string
  'Commission de souscription': number
  ' Commission de rachat': number
  'Frais de gestion': number | '-'
}

const legalHandler = (value: string) => (value === 'FCP' ? 2 : 1)

const catHandler = (value: string) =>
  categories.findIndex((x) => x.name === value) + 1

const periodicityHandler = (value: string) => (value === 'weekly' ? 2 : 1)

const load = async (file: string) => {
  const xlsxData = await fs.readFile(path.resolve(__dirname, file))

  const buffer = xlsxData
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

  const output: Array<Fund> = XLSX.utils.sheet_to_json(firstSheet)

  return output
}

const addLookupValues = async () => {
  // legal types [SICAV, FCP]
  const legalVals = await prisma.legal_types.createMany({
    data: legal_types,
  })
  // categories [Actions, OMLT, Monétaire, Diversifié, OCT, Contractuel]
  const categoryVals = await prisma.categories.createMany({
    data: categories,
  })
  // periodicities [Daily, Weekly]
  const periodicityVals = await prisma.periodicities.createMany({
    data: periodicities,
  })

  return [legalVals, categoryVals, periodicityVals]
}

const addFunds = async () => {
  const funds = await load('./seedFile.xlsx')

  for (let i = 0; i < funds.length; i++) {
    const manager = await prisma.managers.upsert({
      where: {
        manager_name: funds[i]['Société de Gestion'],
      },
      update: {},
      create: {
        manager_name: funds[i]['Société de Gestion'],
      },
    })

    await prisma.funds.create({
      data: {
        name: funds[i]['Dénomination OPCVM'],
        isin_code: funds[i]['CODE ISIN'],
        mc_code: funds[i]['Code Maroclear'].toString(),
        managed_by: manager.id,
        legal_type: legalHandler(funds[i]['Nature juridique']),
        category: catHandler(funds[i].Classification),
        periodicity: periodicityHandler(funds[i]['Périodicité VL']),
      },
    })

    await prisma.rates.upsert({
      where: {
        isin_code: funds[i]['CODE ISIN'],
      },
      update: {},
      create: {
        subscription_fee: funds[i]['Commission de souscription'],
        mgt_fee:
          funds[i]['Frais de gestion'] === '-'
            ? 0
            : funds[i]['Frais de gestion'], // data source inconsistency
        redemption_fee: funds[i][' Commission de rachat'],
        funds: {
          connect: {
            isin_code: funds[i]['CODE ISIN'],
          },
        },
      },
    })
  }
}

const seedDB = async () => {
  await addLookupValues()
  await addFunds()
}

seedDB()
  .then(async () => {
    await prisma.$disconnect
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
