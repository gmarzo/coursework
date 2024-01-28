import Foundation

//Exercise #1
struct NegativeAmountError: Error {}

func change(_ cents: Int) -> Result<(Int, Int, Int, Int), NegativeAmountError> {
    if (cents < 0) {
        return .failure(NegativeAmountError())
    } else {
        var centsCopy = cents 
        var changeArray: Array<Int> = [] // stores the change given from cents
        let coins = [25, 10, 5]
        for coin in coins {
            let (quo, rem) = centsCopy.quotientAndRemainder(dividingBy: coin)
            changeArray.append(quo)
            centsCopy = rem
        }
        return .success((changeArray[0], changeArray[1], changeArray[2], centsCopy))
        // centsCopy represents the number of pennies, ie the left over amount
    }
}


//Exercise #2
extension String {
    var stretched: String {
        let noWhiteSpaces = Array(self.filter{ !$0.isWhitespace })
        var answer = ""
        for (index, element) in noWhiteSpaces.enumerated() {
            answer.append(contentsOf: String(repeating: element, count: (index + 1)))
        }
        return answer
    }
}


//Exercise #3
extension Array {
    func mapThenUnique<T: Hashable>(f: (Element) -> T) -> Set<T> {
        return Set( map{ f($0) })
    }
}


//Exercise #4
func powers(of: Int, through: Int, _ consumer: (_  : Int) -> Void) -> Void {
    for power in 0...through {
        let poweredNum = Int(pow(Double(of), Double(power)))
        if poweredNum > through {break}
        consumer(poweredNum)
    }
}


//Exercise #5
protocol Animal {
    var name: String {get}
    var sound: String {get}
}

extension Animal{
    func speak() -> String{
        return "\(name) says \(sound)"
    }
}

struct Cow: Animal{    
    var name: String
    var sound: String {return "moooo"}
}

struct Horse: Animal{
    var name: String
    var sound: String {return "neigh"}
}

struct Sheep: Animal{
    var name: String
    var sound: String {return "baaaa"}
}


//Exercise #6
struct say{
    var phrase: String

    init(_ phrase: String){
        self.phrase = phrase
    }

    func and(_ word: String) -> say{
        return say("\(phrase) \(word)")
    }
}


//Exercise #7
func twice<T>(_ f: (T) -> T, appliedTo: T) -> T{
    return f(f(appliedTo))
}


//Exercise #8
func uppercasedFirst(of: [String], longerThan: Int) -> String?{
    return of.first(where: { $0.count > longerThan})?.uppercased()
}
