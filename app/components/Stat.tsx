interface StatProps {
  value?: string
  description: string
}

export default function Stat({ value, description }: StatProps) {
  return (
    <div>
      <p className="md:text-3xl text-xl font-semibold">
        {Number(value) * 100} %
      </p>
      <p className="text-xs font-medium text-gray-400">{description}</p>
    </div>
  )
}
