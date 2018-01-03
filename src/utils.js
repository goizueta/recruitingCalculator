export default function simulate(
    STARTING_COMPANY_SIZE,
    MONTHS_TO_SIMULATE,
    YEARLY_ATTRITE_CHANCE,
    HC_GROWTH_RATE
) {
    console.log(
        STARTING_COMPANY_SIZE,
        MONTHS_TO_SIMULATE,
        YEARLY_ATTRITE_CHANCE,
        HC_GROWTH_RATE
    )
    var NUM_SIMULATIONS = 100

    // Recruitment numbers by month, starting with month 0
    var target_size = [STARTING_COMPANY_SIZE]
    for (var i = 1; i < MONTHS_TO_SIMULATE + 1; i++) {
        target_size.push(grow_a_month(target_size[i - 1]))
    }
    console.log(target_size)

    var hired_array = []
    var lost_array = []
    var companies_after_backfill = []
    var total_employees_to_hire = 0
    var total_employees_attrited = 0
    var company = Array(target_size[0]).fill(0) // contains the number of months of age for the employee at index i

    for (var i = 0; i < NUM_SIMULATIONS; i++) {
        run_full_simulation()
    }

    console.log("-------------------------------------------------------------")
    console.log("__AVG OVER " + NUM_SIMULATIONS + " SIMULATIONS__")
    console.log("Hired: " + avg(hired_array))
    console.log("Lost: " + avg(lost_array))

    var return_obj = {
        hired: avg(hired_array),
        lost: avg(lost_array),
        company_history: companies_after_backfill
    }

    return return_obj

    //
    // Helper functions

    function run_full_simulation() {
        company = Array(target_size[0]).fill(0) // contains the number of months of age for the employee at index i

        // iterate over every month
        for (var i = 1; i < MONTHS_TO_SIMULATE + 1; i++) {
            simulate_company_for_month(i)
        }
        if (hired_array.length == 0) {
            console.log(
                "-------------------------------------------------------------"
            )
            console.log("__TOTAL__")
            console.log("Hired: " + total_employees_to_hire)
            console.log("Lost: " + total_employees_attrited)
            if (NUM_SIMULATIONS > 1)
                console.log(
                    "Running " + NUM_SIMULATIONS + " additional simulations..."
                )
        }
        clean_up_globals()
    }

    function clean_up_globals() {
        hired_array.push(total_employees_to_hire)
        lost_array.push(total_employees_attrited)
        total_employees_to_hire = 0
        total_employees_attrited = 0
    }

    function simulate_company_for_month(month_index) {
        var num_lost = attrite_employees()
        var num_hired = hire_employees(month_index)

        // Only report for first sim
        if (hired_array.length == 0) {
            report_on_company(month_index, num_lost, num_hired)
        }
    }

    function report_on_company(month_index, num_lost, num_hired) {
        var prev_size =
            month_index > 0
                ? target_size[month_index - 1]
                : STARTING_COMPANY_SIZE

        console.log(
            "------------------ End of Month " +
                month_index +
                " ---------------------------"
        )
        console.log("--- Company Size Last Month: " + prev_size)
        console.log("--- Company Size This Month: " + company.length)
        console.log("--- Lost this month: " + num_lost)
        console.log("--- Hired this month: " + num_hired)
        console.log("--- Age in months of employees: " + company)
    }

    // Making assumption here that we always hire every month to hit our target size
    function hire_employees(month_index) {
        var curr_company_size = get_company_size()
        if (target_size[month_index] > curr_company_size) {
            var num_to_hire = target_size[month_index] - curr_company_size
            // console.log("Time to hire!")
            // console.log("Current Size: " + curr_company_size + " Target Size: " + target_size[month_index])
            // console.log("Hiring " + num_to_hire + " new employees")
            total_employees_to_hire += num_to_hire
            backfill_employees()
            while (target_size[month_index] > get_company_size()) {
                company.push(0)
            }
            // Add array of current company size
            if (companies_after_backfill.length < MONTHS_TO_SIMULATE)
                companies_after_backfill.push(company.slice())

            return num_to_hire
        }

        return 0
    }

    function backfill_employees() {
        for (var i = 0; i < company.length; i++) {
            if (company[i] == -1) {
                company[i] = 0
            }
        }
    }

    function get_company_size() {
        var count = 0
        for (var i = 0; i < company.length; i++) {
            if (company[i] != -1) {
                count++
            }
        }
        return count
    }

    function grow_a_month(last_month_size) {
        return Math.round(last_month_size * getMonthlyGrowthRate(HC_GROWTH_RATE))
    }

    function attrite_employees() {
        // console.log('Employees are considering leaving...')
        for (var i = 0; i < company.length; i++) {
            var employee = company[i]
            if (!is_employee_still_here()) {
                // If the person hasn't attrited yet
                company[i] = -1
            } else {
                company[i] = company[i] + 1 // Otherwise, increase their age by one month
            }
        }
        var num_attrited = company.length - get_company_size()
        total_employees_attrited += num_attrited

        // num_attrited > 0 ? console.log("Lost " + num_attrited + " good (wo)men out there...") : console.log("Phew...they all stayed")
        return num_attrited
    }

    function is_employee_still_here() {
        var monthly_attrite_chance = getMonthlyAttriteChance(
            YEARLY_ATTRITE_CHANCE / 100
        )
        if (Math.random() < monthly_attrite_chance) {
            return false
        }
        return true
    }

    function getMonthlyAttriteChance(yearly_chance) {
        var monthly_chance = 1 - Math.pow(1 - yearly_chance, 1 / 12)
        return monthly_chance
    }

    function getMonthlyGrowthRate(yearly_rate) {
        var monthly_rate = Math.pow((1 + yearly_rate / 100), 1 / 12)
        console.log(monthly_rate)
        return monthly_rate
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
    }

    function avg(arr) {
        var sum = arr.reduce(function(a, b) {
            return a + b
        })
        return Math.round(sum / arr.length)
    }
}
