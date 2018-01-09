## Recruiting Calculator
This bare bones web app creates a hiring plan that takes company attrition into account by simulating a company with employees that churn every month.

### Motivation
At my company, we needed to create a hiring plan to meet our yearly growth target. It seemed trivial, but became much more complex when we took into account the fact that some employees would churn every month, and we needed to hire their replacements, who also might churn, etc...

Searching online produced very few helpful results, so I decided to build a web app to get the job done. Since my stats skills were a bit rusty, I brute forced the problem by simulating companies and employees thousands of times, and took the average of those simulations.

### Inputs
- Company Size
- Desired Growth Rate
- Yearly Attrition Rate
- Length of time to simulate

### Outputs
- Employees lost to attrition
- Total employee hires needed to meet goals

### Installing and Running Locally
```
npm install
npm start
```

### Credits
- Bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
- Inspired by [Sequoia's Recruiting Calculator](https://www.sequoiacap.com/recruiting-calculator#).

## License

MIT © Roberto Goizueta
