export const useHourse = function(namespace){
    return function(){
        return`${namespace}-${parseInt(Math.random().toString().slice(2,9)).toString(16)}`
    }
}

export const useUser = function(id){
    const name = 'user'
    const result = `${name}-${id}`
    return result
}