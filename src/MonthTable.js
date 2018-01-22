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

        var med_months = this.props.med_months
        var worst_months = this.props.worst_months
        // Makes the employee additions discrete instead of cumulative
        for (var i = med_months.length - 1; i > -1; i--) {
            if (i !== 0) {
                med_months[i].y -= med_months[i - 1].y
            }
        }

        for (var i = worst_months.length - 1; i > -1; i--) {
            if (i !== 0) {
                worst_months[i].y -= worst_months[i - 1].y
            }
            med_months[i].z = worst_months[i].y
        }

        this.state = {
            med_months: med_months
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

        const leftHeaderStyle = {
            fontSize: "1.2em",
            width: "3em"
        }

        const centerStyle = {
            marginLeft: "25%",
            marginRight: "25%",
            marginBottom: "10rem"
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
                                <TableHeaderColumn style={leftHeaderStyle}>
                                    Month
                                </TableHeaderColumn>
                                <TableHeaderColumn style={headerStyle}>
                                    Hires (Median Case)
                                </TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.state.med_months.map(row => {
                                return <TRow key={row.x} row={row} />
                            })}
                        </TableBody>
                    </Table>
                </MuiThemeProvider>
            </div>
        )
    }
}
