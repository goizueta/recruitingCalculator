import React from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table"

export default class MonthTable extends React.Component {
    constructor(props) {
        super(props)

        var months = this.props.months
        // Makes the employee additions discrete instead of cumulative
        for (var i = months.length - 1; i > -1; i--) {
            if (i !== 0) {
                months[i].y -= months[i - 1].y
            }
        }

        this.state = {
            months: months
        }
    }

    render() {
        const TRow = ({ row }) => (
            <TableRow>
                <TableRowColumn>{row.x}</TableRowColumn>
                <TableRowColumn>{row.y}</TableRowColumn>
            </TableRow>
        )

        const tableHeight = "21em"

        const headerStyle = {
            fontSize: "1.2em"
        }

        const centerStyle = {
            marginLeft: "32%",
            marginRight: "32%"
        }

        return (
            <div style={centerStyle}>
                <MuiThemeProvider>
                    <Table height={tableHeight}>
                        <TableHeader
                            adjustForCheckbox={false}
                            displaySelectAll={false}
                        >
                            <TableRow>
                                <TableHeaderColumn style={headerStyle}>
                                    Month
                                </TableHeaderColumn>
                                <TableHeaderColumn style={headerStyle}>
                                    Employees To Hire
                                </TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.state.months.map(row => {
                                return <TRow key={row.x} row={row} />
                            })}
                        </TableBody>
                    </Table>
                </MuiThemeProvider>
            </div>
        )
    }
}
