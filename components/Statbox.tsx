interface StatProps {
    value: number,
    description: string
}

export default function Statbox({value, description}: StatProps) {
    return (
        <div>
            <p className="text-4xl font-semibold">{value} %</p>
            <p className="text-xs font-medium text-gray-400">{description}</p>
        </div>
    )
}