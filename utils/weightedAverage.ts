type Average = {
    weight: number,
    index: number
}
type Averages = Average[]
var wA = (averages: Averages) => {
    //sum of all weights
    var sum = 0
    for (var average of averages) {
        sum += average.weight
    }
    //get random sum
    var random = Math.floor(
        Math.random() * (sum)
    )
    //go through sums until right one
    var currentMax = 0
    for (var ave of averages) {
        currentMax += ave.weight
        if (random < currentMax) {
            return ave.index
        }
    }

    return null
}
export default wA

type Weight = number
type WeightArray = Weight[]

var autoIndexer = (array: WeightArray) => {
    var averages: Averages = []
    var index = 0
    for (var item of array) {
        averages.push({ index, weight: item })
        index++
    }
    return averages
}

//test
// var test = () => {
//     var nula = 0
//     var jedna = 0
//     var dva = 0
//     for (var i = 0; i < 10001; i++) {
//         var ans = wA(autoIndexer([1, 1]))
//         if (ans === 0) {
//             nula++
//         }
//         else if (ans === 1) {
//             jedna++
//         }
//         else {
//             dva++
//         }
//     }
// }
// export { test }