export const useHourse = function(){
    const name = 'hourse'
    const result = `${name}-${parseInt(Math.random().toString().slice(2,9)).toString(16)}`
    return result
}

export const useUser = function(id){
    const name = 'user'
    const result = `${name}-${id}`
    return result
}