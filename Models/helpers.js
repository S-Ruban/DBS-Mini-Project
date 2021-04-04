const setStatement = (patch, initialNum = 1) => {
    let query = `SET`
    let params = [];
    let i = 0;
    for (let key in patch) {
        if(i)
            query += ",";
        query += ` ${key} = $${initialNum + i}`;
        params.push(patch[key]);
        i += 1;
    }
    return {query, params, nextIndex: initialNum+i};
};


module.exports = {setStatement};