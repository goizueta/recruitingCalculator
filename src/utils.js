export default function simulate(
    STARTING_COMPANY_SIZE,
    MONTHS_TO_SIMULATE,
    LOST_EMPLOYEES_LAST_YEAR,
    HC_GROWTH_RATE
) {
    const NUM_SIMULATIONS = 1000
    const YEARLY_ATTRITE_CHANCE =
        LOST_EMPLOYEES_LAST_YEAR / STARTING_COMPANY_SIZE
    console.log(YEARLY_ATTRITE_CHANCE)

    // Recruitment numbers by month, starting with month 0
    var target_size = [STARTING_COMPANY_SIZE]
    for (var i = 1; i < MONTHS_TO_SIMULATE + 1; i++) {
        target_size.push(grow_a_month(target_size[i - 1]))
    }

    var hired_array = []
    var lost_array = []
    var company_months_after_backfill = []
    var total_employees_to_hire = 0
    var total_employees_attrited = 0
    var company = Array(target_size[0]).fill(0) // contains the number of months of age for the employee at index i

    for (var k = 0; k < NUM_SIMULATIONS; k++) {
        run_full_simulation()
    }

    var median_company_history = get_median_company()
    var worst_company_history = get_worst_company()

    var return_obj = {
        med_hired: get_median(hired_array),
        med_lost: get_median(lost_array),
        med_company_history: median_company_history,
        worst_hired: get_worst_elem(hired_array),
        worst_lost: get_worst_elem(lost_array),
        worst_company_history: worst_company_history
    }

    return return_obj

    //
    // Helper functions

    function get_median(arr) {
        arr.sort((a, b) => {
            return a - b
        })
        return arr[arr.length / 2]
    }

    function get_worst_elem(arr) {
        arr.sort((a, b) => {
            return a - b
        })
        return arr[arr.length * 9 / 10]
    }

    function get_median_company() {
        var simulations = get_sorted_sims()

        return simulations[simulations.length / 2]
    }

    function get_worst_company() {
        var simulations = get_sorted_sims()

        return simulations[simulations.length * 9 / 10]
    }

    function get_sorted_sims() {
        var simulations = []
        var num_simulations =
            company_months_after_backfill.length / MONTHS_TO_SIMULATE

        // Transform 1D company_months array into 2D simulations array and sort by new hires
        for (var i = 0; i < num_simulations; i++) {
            var new_sim = []
            for (var j = 0; j < MONTHS_TO_SIMULATE; j++) {
                new_sim.push(
                    company_months_after_backfill[i * MONTHS_TO_SIMULATE + j]
                )
            }
            simulations.push(new_sim)
        }
        simulations.sort(sort_by_new_hires)

        return simulations
    }

    function sort_by_new_hires(a, b) {
        var count_new_hired_a = 0
        var count_new_hired_b = 0
        for (var i = 0; i < MONTHS_TO_SIMULATE; i++) {
            count_new_hired_a += a[i].filter(is_zero).length
            count_new_hired_b += b[i].filter(is_zero).length
        }
        return count_new_hired_a - count_new_hired_b
    }

    function is_zero(x) {
        return x === 0
    }

    function run_full_simulation() {
        company = Array(target_size[0]).fill(0) // contains the number of months of age for the employee at index i

        // iterate over every month
        for (var i = 1; i < MONTHS_TO_SIMULATE + 1; i++) {
            simulate_company_for_month(i)
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
        attrite_employees()
        hire_employees(month_index)
    }

    // Making assumption here that we always hire every month to hit our target size
    function hire_employees(month_index) {
        var curr_company_size = get_company_size()
        if (target_size[month_index] > curr_company_size) {
            var num_to_hire = target_size[month_index] - curr_company_size
            total_employees_to_hire += num_to_hire
            backfill_employees()
            while (target_size[month_index] > get_company_size()) {
                company.push(0)
            }
            // Add array of current company size
            company_months_after_backfill.push(company.slice())

            return num_to_hire
        }
        // Add array of current company size
        company_months_after_backfill.push(company.slice())

        return 0
    }

    function backfill_employees() {
        for (var i = 0; i < company.length; i++) {
            if (company[i] === -1) {
                company[i] = 0
            }
        }
    }

    function get_company_size() {
        var count = 0
        for (var i = 0; i < company.length; i++) {
            if (company[i] !== -1) {
                count++
            }
        }
        return count
    }

    function grow_a_month(last_month_size) {
        return Math.round(
            last_month_size * getMonthlyGrowthRate(HC_GROWTH_RATE)
        )
    }

    function attrite_employees() {
        for (var i = 0; i < company.length; i++) {
            if (!is_employee_still_here()) {
                // If the person hasn't attrited yet
                company[i] = -1
            } else {
                company[i] = company[i] + 1 // Otherwise, increase their age by one month
            }
        }
        var num_attrited = company.length - get_company_size()
        total_employees_attrited += num_attrited

        return num_attrited
    }

    function is_employee_still_here() {
        var monthly_attrite_chance = getMonthlyAttriteChance(
            YEARLY_ATTRITE_CHANCE
        )
        var random_chance = Math.random()
        if (random_chance < monthly_attrite_chance) {
            return false
        }
        return true
    }

    function getMonthlyAttriteChance(yearly_chance) {
        var monthly_chance = 1 - Math.pow(1 - yearly_chance, 1 / 12)
        return monthly_chance
    }

    function getMonthlyGrowthRate(yearly_rate) {
        var monthly_rate = Math.pow(1 + yearly_rate / 100, 1 / 12)
        return monthly_rate
    }

    // Console logging to assist with debugging
    // function report_on_company(month_index, num_lost, num_hired) {
    //     var prev_size =
    //         month_index > 0
    //             ? target_size[month_index - 1]
    //             : STARTING_COMPANY_SIZE

    //     console.log(
    //         "------------------ End of Month " +
    //             month_index +
    //             " ---------------------------"
    //     )
    //     console.log("--- Company Size Last Month: " + prev_size)
    //     console.log("--- Company Size This Month: " + company.length)
    //     console.log("--- Lost this month: " + num_lost)
    //     console.log("--- Hired this month: " + num_hired)
    //     console.log("--- Age in months of employees: " + company)
    // }
}
