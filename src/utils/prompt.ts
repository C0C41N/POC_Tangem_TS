export function prompt(question: string): Promise<string> {

  return new Promise(resolve => {

      const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout })

      rl.question(question, (answer: string) => {
          resolve(answer)
          rl.close()
      })

  })
}