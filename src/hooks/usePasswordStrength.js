import { useQuery } from "react-query";

export default (payload) => {
  return useQuery('password-strength', () => fetch('https://api-staging-0.rain.bh/api/1/password/strength', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
  }))
}
