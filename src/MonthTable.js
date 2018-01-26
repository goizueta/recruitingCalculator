import React from "react"

export default class MonthTable extends React.Component {
    constructor(props) {
        super(props)

        var med_months = this.props.med_months
        var worst_months = this.props.worst_months
        // Makes the employee additions discrete instead of cumulative
        for (var i = med_months.length - 1; i > -1; i--) {
            if (i !== 0) {
                med_months[i].y -= med_months[i - 1].y
            }
        }

        for (var j = worst_months.length - 1; j > -1; j--) {
            if (j !== 0) {
                worst_months[j].y -= worst_months[j - 1].y
            }
            med_months[j].z = worst_months[j].y
        }

        this.state = {
            med_months: med_months
        }
    }

    render() {
        const TRow = ({ row }) => (
            <tr>
                <td>{row.x}</td>
                <td>{row.y}</td>
            </tr>
        )

        const centerStyle = {
            marginLeft: "auto",
            marginRight: "auto"
        }

        return (
            <div style={centerStyle}>
                <table className="u-full_width" style={centerStyle}>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Hires (Median Case)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.med_months.map(row => {
                            return <TRow key={row.x} row={row} />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
