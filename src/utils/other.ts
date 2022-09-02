export const useUser = function(){
    const name = 'user'
    const result = `${name}-${parseInt(Math.random().toString().slice(2,9)).toString(16)}`
    return result
}