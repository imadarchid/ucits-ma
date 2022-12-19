import { trpc } from "../utils/trpc";
import { PerformanceChart } from "./PerformanceChart";
import Statbox from "./Statbox";

interface BoxProps {
    isin_code: string
}

export const Resultbox = ({isin_code}: BoxProps) => {
    const fund = trpc.funds.findByIsin.useQuery({ isin_code: isin_code });

    return (
        <div className="mx-auto max-w-5xl mt-8 flex flex-col sm:justify-center">
            <div className="flex flex-row flex-wrap gap-x-2 gap-y-4 md:gap-y-0">
                <div className="max-w-full grow shadow-sm rounded-md border-2 border-solid divide-y">
                    <div id="cardHeader" className="px-4 py-2">
                        <h2><b>⚡Performance</b></h2>
                    </div>
                    <div id="cardContent" className="px-4 py-2">
                        <PerformanceChart dataset={fund.data?.performances}/>
                    </div>
                </div>
                <div className="grow md:w-1/3 rounded-md border-2 border-solid divide-y">
                    <div id="cardHeader" className="px-4 py-2">
                        <h2><b>📄 About</b></h2>
                    </div>
                    <div id="cardContent" className="flex flex-row flex-wrap items-center px-4 py-2">
                        <div className="w-40"><b>{fund.data?.name}</b></div>
                        <div className="grow bg-cover bg-center self-end rounded-md py-8 px-8" style={{ backgroundImage: "url('https://i.le360.ma/fr/sites/default/files/styles/image_la_une_on_home_page/public/assets/images/2020/01/logo.jpg')"}}> 
                        </div>
                        <div>
                            <br></br>
                            <p className="text-sm">{fund.data?.name} is a OPCVM fund type {fund.data?.legal_types?.name} managed by {fund.data?.managers.manager_name}</p>
                        </div>
                        <div className="flex items-center flex-wrap md:flex-row flex-column py-4 md:space-x-2">
                            <Statbox value={fund.data?.rates?.subscription_fee} description={'Subscription Fee'}/>
                            <Statbox value={fund.data?.rates?.mgt_fee} description={'Management Fee'}/>
                            <Statbox value={fund.data?.rates?.redemption_fee} description={'Redemption Fee'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}