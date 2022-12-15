import { PerformanceChart } from "./PerformanceChart";
import Statbox from "./Statbox";

export default function Resultbox() {
    return (
        <div className="mx-auto max-w-5xl mt-8 flex flex-col sm:justify-center">
            <div className="flex flex-row flex-wrap gap-x-2">
                <div className="grow shadow-sm rounded-md border-2 border-solid divide-y">
                    <div id="cardHeader" className="px-4 py-2">
                        <h2><b>⚡Performance</b></h2>
                    </div>
                    <div id="cardContent" className="px-4 py-2">
                        <PerformanceChart />
                    </div>
                </div>
                <div className="grow w-1/3 rounded-md border-2 border-solid divide-y">
                    <div id="cardHeader" className="px-4 py-2">
                        <h2><b>📄 About</b></h2>
                    </div>
                    <div id="cardContent" className="flex flex-row flex-wrap items-center px-4 py-2">
                        <div className="w-40"><b>FCP AKHAWAYN CAPITAL PRIMO PLIS</b></div>
                        <div className="grow bg-cover bg-center self-end rounded-md py-8 px-8" style={{ backgroundImage: "url('https://i.le360.ma/fr/sites/default/files/styles/image_la_une_on_home_page/public/assets/images/2020/01/logo.jpg')"}}> 
                        </div>
                        <div>
                            <p className="text-sm">FCP AKHAWAYN CAPITAL PRIMO PLIS is a OPCVM fund type CASH managed by BCP OPCI MGT</p>
                        </div>
                        <div className="flex items-center flex-wrap flex-row py-4 space-x-2">
                            <Statbox value={5} description={'Management Fee'}/>
                            <Statbox value={5} description={'Management Fee'}/>
                            <Statbox value={5} description={'Management Fee'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}