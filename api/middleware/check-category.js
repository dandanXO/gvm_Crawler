
module.exports = function (req, res, next) {
    let category = req.params.category
    console.log(category)
    if (category === 'chinaandtaiwan' || category === 'currentaffairs' || category === 'education' ||category === 'finance' || category ==='international' || category ==='life'){
        
        next()
        
    }else{
        console.log('illeagla')
        res.status(401).json({
            error: "illegal category"
        })
        return "illegal category"
    }

}