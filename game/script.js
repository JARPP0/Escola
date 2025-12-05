class Shop {
    static values = [];

    constructor(nome, attributes, requirements, price){
        Shop.values.push(this)

        this.name = nome
        this.attributes = attributes
        requirements = Object.entries(requirements).reduce((acc, [key, val]) => {
            acc.push([Pessoa.values[Pessoa.values.findIndex((ele) => ele.name === key)], val])
            return acc
        }, [])
        this.requirements = requirements
        this.requirements = this.requirements.map((ele) => {
            return [...ele, 0]
        })
        this.price = price * (this.isSpecial ? 100 / Pessoa.biomeMultipliers[this.biome] : 1) ** (1/3)
        this.luckAttr = attributes[0]
        this.fortuneAttr = attributes[1]
        this.speedAttr = attributes[2]
        this.afforded = false;
        this.enabled = false;
        this.price = price
        this.acronym = `${this.name.slice(0, 1)}${this.name.slice(-2)}`
    }
    static deposit(shop, name){
        shop = Shop.values[Shop.values.findIndex((ele) => ele.name == shop)]
        name = shop.requirements[shop.requirements.findIndex((ele) => ele[0].name === name)]
        if(!Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.name === name[0].name)]) return;
        if(name[2] === name[1]) return;
        Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.name === name[0].name)][1]--
        name[2]++;
        updateShop()
        console.log(shop.affordable)
        if(Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.name === name[0].name)][1] === 0){
            sellUpdateInventory(name[0].acronym)
            return
        }
        Pessoa.inventory = Pessoa.inventory.map(([o]) => [o, o.quantity])
        Pessoa.inventory = Pessoa.inventory.filter(([obj]) => obj.quantity !== 0)
        document.querySelector(`.inventory-block`).innerHTML = pieceUpdateInventory().join("")
    }
    get affordable(){
        return this.requirements.reduce((acc, ele) => {
            acc.push(ele[2] === ele[1])
            return acc
        }, []).every((ele) => ele)
    }
}
class Pessoa {
    static values = [];
    static mutation = [];
    static breakthrough = [];
    static special = [];  
    static acronym = [];

    static biome0 = [];
    static biome1 = [];
    static biome2 = [];
    static biome3 = [];
    static biome4 = [];
    static biome5 = [];
    static biome6 = [];
    static biome7 = [];
    static biome8 = [];
    static biome9 = [];
    static collection = [];
    static inventory = [];
    static biomeMultipliers = {
        0: 22.513874,
        1: 15.539313,
        2: 14.542319,
        3: 10.389342,
        4: 10.389342,
        5: 2.281487,
        6: 3.286382,
        7: 3.558780,
        8: 11.000938,
        9: 6.163965,
        10: 0.053460,
    }
    static money = 0;

    static audio = {};
    constructor(nome, numbers, description, mutation, audio, colors){
        let biomeList = [`sala`, `patio`, `refeitorio`, `quadra`, `jardim`, `coworking`, `pjmacumba`, `xiquexiquebahia`, `inepresente`, `cosmos`];
        Pessoa.values.push(this)
        this.least = (typeof numbers === `number`) ? numbers: numbers[1]
        Pessoa.values.sort((a, b) => { 
            return a.least - b.least
        })
        this.most = (typeof numbers === `number`) ? numbers: this.most = (numbers[2] === 1) ? numbers[1] : numbers[2]
        this.biome = (typeof numbers === `number`) ? 0 : numbers[0]
        this.name = nome;
        this.rariety = numbers
        this.description = description;
        this.price = Math.round(this.least ** 0.65)
        this.isMutation = mutation ? true: false;
        if(this.isMutation){Pessoa.mutation.push(this)}
        this.mutation = this.isMutation ? mutation: false;
        if(colors){
            this.stroke = colors[1]
            if(colors[2]){
                this.strokepx = colors[2]
            }
            this.fontColors = colors[0]
            this.painelColors = colors[3]
        }
        this.isBreakthrough = typeof numbers !== `number` ? true : false;
        if(this.isBreakthrough){Pessoa.breakthrough.push(this)}
        if(this.isBreakthrough && numbers[2] === 1){Pessoa.special.push(this); this.isSpecial = true;}
        else{this.isSpecial = false;}
        this.audio = audio;

        if(this.isBreakthrough){
            biomeList.forEach((ele, ind) => {
                this[ele] = numbers[0] == ind ? numbers[1] : numbers[2]
            })
            this.breakthrough = numbers.reduce((acc, ele) => {
                return Math.max(ele, acc)
            }, 0)

        }
        else{
            biomeList.forEach((ele) => {
                this[ele] = numbers
            })
        }
        if(this.least > 100){
            let boost = String(this.least)
            do{
                boost = String([...boost].reduce((acc, ele) => {
                    acc += Number(ele)
                    return acc
                }, 0))
            }while(boost >= 10)
            if(boost < 3){
                this.type = 0
            }
            else if(boost < 7){
                this.type = 1
            }
            else{
                this.type = 2
            }
            if(this.type === 0){
                this.boost = [((Math.log(120 + this.least) / Math.log(120) - 1) * (this.isSpecial ? 100 / Pessoa.biomeMultipliers[this.biome] : 1) ** (1/3)).toFixed(2), this.type]
            }
            if(this.type === 1){
                this.boost = [((Math.log(40 + this.least) / Math.log(40) - 1) * (this.isSpecial ? 100 / Pessoa.biomeMultipliers[this.biome] : 1) ** (1/3)).toFixed(2), this.type]
            }
            if(this.type === 2){
                this.boost = [((Math.log(1 + this.least) - 1) * (this.isSpecial ? 100 / Pessoa.biomeMultipliers[this.biome] : 1) ** (1/3)).toFixed(2), this.type]
            }
        }
        this.collectSet = this.isBreakthrough && !this.isSpecial ? {max: false, min: false, variations: []}: {min: false, variations: []}
        this.fullName = this.isMutation ? `${nome} : ${mutation}` : nome;
        let acronym = `${this.fullName.slice(0, 1)}${this.fullName.slice(-2)}`
        acronym = acronym.toLowerCase();
        [`)`, `(`, `-`, `³`, `.`].forEach((ele) => {
            acronym = acronym.replaceAll(ele, `u`)
        })
        acronym = acronym.replaceAll(` `, `s`)
        let repetitionNumber = 0;
        let old = acronym
        while(Pessoa.acronym.findIndex(ele => ele === acronym) !== -1){
            repetitionNumber++;
            acronym = `${old}${repetitionNumber}`
        }
        Pessoa.acronym.push(acronym)
        this.acronym = acronym;

        [this.sala, this.patio, this.refeitorio, this.quadra, this.jardim, this.coworking, this.pjmacumba, this.xiquexiquebahia, this.inepresente, this.cosmos].forEach((ele, ind) => {
            if(ele !== 1){
                if(this.isBreakthrough){
                    eval(`Pessoa.biome${ind}`).push([this.least, this.fullName, this.acronym, false, this.biome, this.most]);
                    if(!this.isSpecial){
                        [old, this.least] = [this.least, this.breakthrough]
                        eval(`Pessoa.biome${ind}`).push([this.least, this.fullName, this.acronym, true, this.biome, this.most]);
                        this.least = old;
                    }
                }
                else{
                    eval(`Pessoa.biome${ind}`).push([this.least, this.fullName, this.acronym, false, this.biome, this.most]);
                }
            }
        })

        for(let i = 0; i < 10; i++){
            eval(`Pessoa.biome${i}.sort((a, b) => a[5] - b[5])`)
        }
        this.roll = function roll(luck, biome){
            let rnd = Math.random();
            let disable = false;
            biomeList.forEach((ele, ind) => {
                if(biome === ind && !disable){biome = this[ele]; disable = true;}
            })
            if(biome / luck <= 1){
                return [false, biome === this.breakthrough, biome, this.acronym]
            }
            else{
                return [rnd < 1/(biome / luck), biome === this.breakthrough && !this.isSpecial, biome, this.acronym]
            }
        }
        if(audio) Pessoa.audio[`${acronym}aud`] = audio[1]
    }
    get isCollected(){
        if(this.isBreakthrough && !this.isSpecial){
            return this.collectSet.min || this.collectSet.max;
        }
        else{
            return this.collectSet.min
        }
    }
    get variations(){
        let mutationList = Pessoa.values.filter((ele) => {
            return JSON.stringify(ele.name) === JSON.stringify(this.name)
        })
        mutationList = mutationList.filter((ele) => {
            return ele !== this
        }).map((ele) => {
            return [ele, ele.isCollected]
        })
        return mutationList
    }
    get collectInfo(){
        if(this.isBreakthrough && !this.isSpecial){
            return [this.isCollected, this.collectSet.min, this.collectSet.max, this.variations]
        }
        return [this.isCollected, this.collectSet.min, this.variations]
    }
    get quantity(){
        if(Pessoa.inventory.some((ele) => {
            return ele[0].fullName === this.fullName
        })){
            return Pessoa.inventory[Pessoa.inventory.findIndex((ele) => {
            return ele[0].fullName === this.fullName
            })][1]
        }
        else return 0
    }
    get priceTotal(){
        let inventoryListEle = Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => {return obj.acronym === this.acronym})]
        if(inventoryListEle){
            return inventoryListEle[1] * this.price
        }
        else{
            return 0
        }
    }
    static collect(name, breakthrough, type){
        if(typeof breakthrough === 'object'){
            breakthrough = breakthrough[3]
        }
        Pessoa.collected = Pessoa.values[Pessoa.values.findIndex((ele) => {return ele.fullName === name.fullName})].acronym
        if(type === 0){
            if(!Pessoa.collection.some(ele => ele[0].acronym === name.acronym)){
                if(name.isBreakthrough && !name.isSpecial){
                    if(breakthrough){
                        name.collectSet.max = true;
                    }
                    else{
                        name.collectSet.min = true;
                    }
                }
                else{
                    name.collectSet.min = true; 
                }
                Pessoa.collection.push([name, 1])
            }
            else Pessoa.collection[Pessoa.collection.findIndex(ele => ele[0] === name)][1]++;
            Pessoa.collection.sort((a, b) => a[0].least - b[0].least)
        }
        else{
            if(!Pessoa.inventory.some(ele => JSON.stringify(ele[0]) === JSON.stringify(name))){
                Pessoa.inventory.push([name, 1])
            }
            else Pessoa.inventory[Pessoa.inventory.findIndex((ele) => JSON.stringify(ele[0]) === JSON.stringify(name))][1]++;
            Pessoa.inventory.sort((a, b) => a[0].least - b[0].least)
        }
    }
    static roll(luck, biome, fake){
        let list = []
        Pessoa.values.forEach((ele) => {
            let info = ele.roll(luck, biome);
            let isRolled = info[0]
            if(isRolled){
                list.push([info[1], Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === info[3])]])
            }
        })
        list = list.sort((a, b) => {
            return a[1].most - b[1].most
        })
        
        if(list.length === 0){
            let minimum = Pessoa.comum(luck, biome)
            let newest = false;
            if(!fake){
                newest = minimum[1].isCollected
                Pessoa.collect(minimum[1], minimum[0], 0)
                Pessoa.collect(minimum[1], minimum[0], 1)
            }
            return [minimum[1], minimum[0], newest]
        }
        else{
            list.sort((a, b) => a[2] - b[2])
            list = list[list.length - 1]
            let newest = false;
            if(!fake){
                newest = list[1].isCollected
                Pessoa.collect(list[1], list[0], 0)
                Pessoa.collect(list[1], list[0], 1)
            }
            return [list[1], list[0], newest]
        }
    }
    static comum(luck, biome){
        let listCopy = eval(`Pessoa.biome${biome}`)
        listCopy = listCopy.filter((ele, ind) => {return ele[0] > luck || ind + 1 === listCopy.length})
        listCopy = listCopy[0]
        return [listCopy, Pessoa.values[Pessoa.values.findIndex((ele) => ele.fullName === listCopy[1])]]
    }
}
/* iNSTÂNCIAS */
{
// Nome, [biome, neither, rarest], descrição, mutação;
// [Sala(0), Pátio(1), Refeitório(2), Quadra(3), Jardim(4), Coworking(5), PjMacumba(6), XiqueXiqueBahia(7), Inepresente(8), cosmos(9)
let Rodobelo = new Pessoa(`Rodobelo`, [1, 2, 30], `Gato mascote da escola`)
    let Rodobelo1 = new Pessoa(`Rodobelo`, [4, 2468, 24680], `Dono de uma tribo indígena`, `(Líder Catciquista)`, undefined, [["rgba(255, 180, 153, 1)", "rgba(210, 125, 86, 1)"], "rgba(132, 101, 92, 1)", '4px'])
    let Rodobelo2 = new Pessoa(`Rodobelo`, [9, 144012000, 1],  `A ..Mística--- .-.Haverá-.- ...Veles--`, `M.E. potency O.W.`, ["The Cat Evolved Into The Microwave Proof Cat! - Camellia", "../Audios/TheCatEvolvedIntoTheMicrowave-proofCat!.mp3"], [["rgba(191, 102, 255, 1)", "rgba(196, 110, 164, 1)"], "rgba(140, 109, 141, 0)", '0px', "[250, 280, 230, 250]-200-.5"]) // 9 / bioma 9 / 9 planetas /- imperador do sistema solar, busca deuses nos planetas(relação de deuses e planetas) // 144.012.000 - 12 signos / 144 = 12**2 = 100 + 44 = /Julio César(100a.C. - 44a.C.) // A Mística(rodobelo) Haverá(caçar) Veles(deus dos peixes[signo / comida de gato(rodobelo)]) A M H V - deslocamento 12(signo) cifra de césar(júlio césar / líder, similar á gata) = Myth(deuses / mythologic) // MEOW potency / Monarcy Extradimensional Omnipotent Whiskers(bigode de gato) / ..--- .-.-.- ...- = 2.3 = :3(gato) // the cat evolved to a microwave-proof cat

let Marcella = new Pessoa(`Marcella`, 3, `Mina da sala que gosta de ler`)
    let Marcella1 = new Pessoa(`Marcella`, 130500, `Uma raposa sombria selada numa biblioteca infinita`, `Babel`, ["Freedom Dive - xi", "../Audios/FreedomDive.mp3"], [["rgb(255, 255, 255)", "rgba(0, 187, 255, 1)"], "rgba(204, 255, 241, 0.71)", '0px', "[130, 180, 130]-140-0.3"]) // freedom dive

let Bia = new Pessoa(`Bia`, 4, `'Sobrecarga de Mídias'`)
    let Bia1 = new Pessoa(`Bia`, 144, `A única que perdi, foi para doar dindin`, `Rica de truco`)

let Paulo = new Pessoa(`Paulo`, [2, 5, 70], `Metade humano, metade rato`)
    let Paulo1 = new Pessoa(`Paulo`, [7, 700, 7000], `Trabaia nas ruas, na vivência do salário mínimo`, `Gari`)
    let Paulo2 = new Pessoa(`Paulo`, [4, 2000, 1], `Um cristal que Paulo jones procurava`, `Chesse Gem`, undefined, [["rgb(255, 136, 72)", "rgba(255, 255, 0, 1)"], "rgba(245, 91, 20, 1)"])
    let Paulo3 = new Pessoa(`Paulo`, 555000, `Mim deixo ver se eu entendi, sua cantoria atrai mulheres para seu exército? EXATAMENTE`, `Gostosão`, ["Já que me ensinou a beber - Os barões da pisadinha", "../Audios/JáQueMeEnsinouABeber.mp3"], [["rgba(255, 168, 92, 1)", "rgba(255, 153, 153, 1)", "rgba(255, 194, 254, 1)"], "rgba(42, 92, 157, 1)", "5px", "[380, 150, 380, 380]-150-1"]) // já que me ensinou a beber

let Arthur = new Pessoa(`Arthur`, 8, `Obsessão por Cartas`)
    let Arthur1 = new Pessoa(`Arthur`, [6, 32960, 494400], `Armadura, Metal Bat, Cheatin'Balatro e mutação de maconheiro`, `MBChB-III.deck`, undefined, [["rgba(37, 37, 37, 1)", "rgba(0, 0, 0, 1)"], "rgba(43, 43, 43, 1)"])

let Pedro = new Pessoa(`Pedro`, [5, 10, 150], `Pleno, Pequeno, Não ocupa terreno, e fala: posto e torto que dá desconforto`)
    let Pedro1 = new Pessoa(`Pedro`, [7, 1010, 1], `E estou virando: O PEDRO HEN-RICO`, `EmpresárioCLT`)
    let Pedro2 = new Pessoa(`Pedro`, [8, 101010, 1], `'Me dá dinheiro'`, `onu.inss.₱€Đ₹Ø.brl.ibge`,  ["Inking Mistake - NyxTheShield", "../Audios/InkingMistake.mp3"], [["rgb(161, 255, 132)", "rgba(255, 242, 0, 1)", "rgba(250, 255, 173, 1)"], "rgba(86, 121, 83, 1)", '3px', "[100, 40, 100, 40, 100]-500-1"]) // inking mistake

let Sabrina = new Pessoa(`Sabrina`, 12, `puro pop`)
    let Sabrina1 = new Pessoa(`Sabrina`, [8, 150000, 600000], `O olho dela já inventou umas 30 cores`, `Fofíris`, ["magnolia x pimp named slickback [Gyspy Woman & Roblox wave sound effect remix] - Playboi Carti, LAKIM, Gyspy Woman, D4DJ", "../Audios/MxPNSB[GW&RWSER].mp3"], [["rgb(255, 0, 170)", "rgba(255, 0, 106, 1)", "rgba(198, 255, 77, 1)"], "rgba(255, 237, 219, 1)", undefined, "[10, 360, 370, 10]-200-4"]) // magnolia x pimp named slickback (gyspy woman x roblox wave sound)

let ArthurCorreia = new Pessoa(`ArthurCorreia`, 15, `Rei do gel`)
    let ArthurCorreia1 = new Pessoa(`ArthurCorreia`, 75000, `アーサール POKEMON MASTER コレイア`, `Shuckle`, undefined, [["rgba(255, 0, 0, 1)", "rgba(246, 255, 0, 1)", "rgba(246, 255, 0, 1)"], "rgba(248, 116, 22, 1)", '4px'])
    let ArthurCorreia2 = new Pessoa(`ArthurCorreia`, 7000000, `ONE-PIErcing`, `Animedia`, undefined,  [["rgba(92, 252, 255, 1)", "rgba(55, 255, 98, 1)"], "rgb(235, 255, 161)", undefined, "[100, 10, 500, 10, 100]-250-.7"])

let Julia = new Pessoa(`Julia`, [1, 17, 51], ``)

let Kauany = new Pessoa(`Kauany`, 20, `Pesadelo do alcides`)
    let Kauany1 = new Pessoa(`Kauany`, 260, `e #### no ## com #### ###### bem #######`, `funkin`)

let Marcos = new Pessoa(`Marcos`, [5, 30, 1500], `olha mãe, eu tou no jogo!`)

let Yas = new Pessoa(`YAS`, 30, ``)

let Vinicius = new Pessoa(`Vinícius`, [2, 25, 125], `Gosta de Strôgonobòlónofóff`)
    let Vinicius1 = new Pessoa(`Vinícius`, [4, 386100, 1], `Maldito Talento`, `Gnose`, ["Censored!! - t+pazolite", "../Audios/Censored.mp3"], [["rgba(19, 255, 15, 1)", "rgba(20, 255, 220, 1)", "rgba(255, 56, 195, 1)"], "rgba(95, 92, 255, 1)", undefined, "[90, 160, 300, 90]-400-2"]) // censored!!

let Lucas = new Pessoa(`Lucas`, 45, `Assistindo rolar a bola, tomando coca-cola vindo da sacola`)
    let Lucas1 = new Pessoa(`Lucas`, [3, 3600, 10800], `LuCR7 atira no gol, do outro gol`, `CR7`, undefined, [["rgb(26, 132, 49)", "rgba(113, 202, 99, 1)", "rgba(85, 255, 0, 1)"], "rgba(80, 155, 99, 1)", '3px'])

let Nathan = new Pessoa(`Nathan`, 45, `Ouh, ALEXA, ouh, ouh, ALEXA!`)
    let Nathan1 = new Pessoa(`Nathan`, [3, 5400, 16200], `Jogador Profissa`, `Camisa10`, undefined, [["rgba(26, 132, 90, 1)", "rgba(99, 202, 152, 1)", "rgba(122, 255, 202, 1)"], "rgba(80, 155, 131, 1)", '3px'])

let Pietro = new Pessoa(`Pietro`, 45, `prazer em conhecer, sou pietro, não calma lá, encantado de conocerte, soy Pietro.`)
    let Pietro1 = new Pessoa(`Pietro`, [6, 202500, 1], `poção: house + pop + dance + dubstep + funk`, `Synthesis`, ["Synthesis - tn.shi", "../Audios/Synthesis.mp3"],  [["rgba(251, 204, 255, 1)", "rgba(173, 20, 255, 1)", "rgba(5, 22, 255, 1)"], "rgba(255, 168, 238, 1)", undefined, "[250, 300, 250, 210, 300, 210, 300, 250]-500-1"]) // synthesis tn-shi

let Wallison = new Pessoa(`Wallison`, [1, 50, 600], `MMA na escola`)

let Titíco = new Pessoa(`Titíco`, 50, `Risadinha, amigo do Walisson`)
    let Titíco1 = new Pessoa(`Titíco`, 500, `Risadinha marota, Risadinha falsa`, `Coringa`, undefined, [["rgb(255, 255, 255)", "rgba(123, 209, 126, 1)", "rgba(127, 217, 63, 1)"], "rgba(80, 180, 105, 1)"])
    let Titíco2 = new Pessoa(`Titíco`, 2500, `ei mn, ta pegando no olho a tinta`, `Fiona`, undefined, [["rgba(122, 245, 153, 1)", "rgba(134, 245, 122, 1)"], "rgba(111, 151, 52, 1)"])

let Alexandre = new Pessoa(`Alexandre`, [1, 55, 1], `Funkeiro redimido`)
    let Alexandre1 = new Pessoa(`Alexandre`, [3, 825, 16500], `Mandando, Devendo, Pão de queijo`, `LÍDER`)
    let Alexandre2 = new Pessoa(`Alexandre`, [8, 412500, 1237500], `uma sala de aula não basta, eu quero comandar a macedônia`, `O GRANDE`, ["Blue Horizon Funk - NXGHT! & DJ ZAP", "../Audios/BlueHorizonFunk.mp3"], [["rgba(187, 147, 124, 1)", "rgba(252, 185, 141, 1)", "rgba(248, 230, 221, 1)"], "rgba(182, 128, 119, 1)", undefined, "[10, 60, 10]-100-2"]) // horizon blue funk
    
let Hiarles = new Pessoa(`Hiarles`, [1, 55, 110], `Gordinho tm`)
   let Hiarles1 = new Pessoa(`Hiarles`, [1, 16500, 33000], `sheriff tm`, `COPS`, undefined, [["rgba(97, 97, 98, 1)", "rgba(94, 88, 95, 1)", "rgba(243, 221, 216, 1)"], "rgba(17, 32, 69, 1)", '3px'])

let Carlos = new Pessoa(`Cabeça`, 60, `beijado sem consentimento, suspeita: 'vinícius'`)
    let Carlos1 = new Pessoa(`Cabeça`, 300000, `facção criminosa em busca da makita`, `Bonde do pneu`, ["Cheiro de somebody that I used to know - Leod", "../Audios/CheiroDePneuQueimado.mp3"], [["rgba(255, 216, 117, 1)", "rgba(255, 61, 61, 1)", "rgba(0, 0, 0, 1)"], "rgba(255, 138, 138, 1)", '3px', "[350]-500-2"]) // Pneu queimado

let Karol = new Pessoa(`Karol`, 62, ``)

let Miguel = new Pessoa(`Miguel`, 65, `se falé baixu`)
    let Miguel1 = new Pessoa(`Miguel`, 455000, `exército super-militar nível maior que bope`, `Bonde da makita`, ["Os Caras tão na Maldade - Yami", "../Audios/OsCarasTãoNaMaldade.mp3"], [["rgba(173, 194, 255, 1)", "rgba(112, 51, 255, 1)"], "rgba(74, 62, 122, 1)", '3px', "[260, 200, 260]-300-2"]) // Os Caras Estão na Maldade

let Guilherme = new Pessoa(`Guilherme`, 69, `'Arco de vilão da torre de cartas destruída'`)
    let Guilherme1 = new Pessoa(`Guilherme`, 552, `Despertada a sua braveza, pronto para aniquilar`, `NegãoMan`, undefined,  [["rgb(0, 0, 0)", "rgba(10, 7, 5, 1)", "rgba(74, 71, 48, 1)"], "rgba(165, 141, 80, 1)"])
    let Guilherme2 = new Pessoa(`Guilherme`, 15333318, `Dê um [[SHOT!!!]] e V(OT)E N0W [[DuArT3 參考]] PRESID{io}ENTE`, `Presid(io)ente`, undefined,  [["rgba(57, 57, 57, 1)", "rgba(10, 7, 5, 1)", "rgba(0, 0, 0, 1)"], "rgba(149, 136, 128, 1)"])

let Davi = new Pessoa(`Davi`, 70, `cuidado que ele vem lutando caipoeira`)
    let Davi1 = new Pessoa(`Davi`, 700000, `seu poder de fogo supera todas as pontas de todas as tecnologias`, `*tech tech* technoloGuy`, ["Million PP - Camellia", "../Audios/MillionPP.mp3"], [["rgba(189, 189, 189, 0.81)", "rgba(226, 225, 226, 0.777)"], "rgba(146, 144, 144, 1)", '3px', "[60, 90, 60]-40-3"]) // million pp

let Bigode = new Pessoa(`Bigode`, [5, 75, 225], `'Reconheço esta curvatura desta pelagem facial de longe'`)

let Luís = new Pessoa(`Luís`, [1, 75, 375], `coitada da jhemile`)

let Matheus = new Pessoa(`Matheus`, 90, `Demolind] sorrindo`)
    let Matheus1 = new Pessoa(`Matheus`, [10, 180, 1], `'?: Ainda possui minha memória falha'`, `REMINESCENCE`, undefined, [["rgba(186, 83, 255, 1)", "rgba(200, 0, 255, 1)", "rgba(255, 0, 217, 1)"], "rgba(216, 189, 255, 1)", '5px', '[282, 200, 240, 282, 282]-200-1'])
    let Matheus2 = new Pessoa(`Matheus`, 1440, `'É U É'`, `Boiadero`, undefined, [["rgb(255, 143, 83)", "rgba(10, 7, 5, 1)", "rgba(217, 202, 63, 1)"], "rgba(224, 202, 144, 1)"])

let Yuri = new Pessoa(`Yuri`, 90, `cuidado para não ser beijado`)
    let Yuri2 = new Pessoa(`Yuri`, 2700, `Tome mais cuidado, ele pode te infectar`, `Shrek`, undefined, [["rgba(194, 245, 122, 1)", "rgba(194, 245, 122, 1)"], "rgba(111, 151, 52, 1)"])
    let Yuri1 = new Pessoa(`Yuri`, [7, 41850, 308250], `FREEFIRE para a vida!`, `FreefiRe p/Vp`, undefined, [["rgb(255, 189, 124)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)"], "rgba(255, 171, 92, 1)", '2px']) //F R V - forever, p/V - para a vida

let Alison = new Pessoa(`Alison`, 100, `De fé, ele é`)
    let Alison1 = new Pessoa(`Alison`, [7, 8000, 24000], `ÍDOLOdoBOX`, `BoxGoat`, undefined, [["rgb(0, 0, 0)", "rgba(255, 0, 0, 1)", "rgba(255, 47, 0, 1)"], "rgba(255, 214, 204, 1)", '3px'])
    let Alison2 = new Pessoa(`Alison`, [8, 400146100, 1], `PROMOVIDO A ASCENSÃO`, `Seraphim`, undefined, [["rgb(116, 129, 255)", "rgba(255, 251, 168, 1)", "rgba(255, 228, 214, 1)"], "rgba(173, 138, 255, 1)", '4px', '[250, 140, 250]-120-.6']) // 400, 400 páginas  between gods de ALISON pick, 400 anos em gênesis 15:13 = 146100 dias

let Alfredo = new Pessoa(`Alfredo`, 150, `Stickman da maria`)
    let Alfredo1 = new Pessoa(`Alfredo`, 1950000, `Este lápis não é para papéis, serve para realidades`, `Sketch`, undefined,  [["rgb(77, 77, 77)", "rgba(96, 94, 94, 1)"], "rgba(116, 116, 116, 1)", undefined, "[100, 240, 100]-40-.4"]) // steel terror

let Yago = new Pessoa(`Yago`, [5, 191, 1], `vítima da sociedade`)
    let Yago1 = new Pessoa(`Yago`, [5, 1337000, 1], ``, `H�cker fantasma`, undefined, [["rgba(164, 226, 255, 0.808)", "rgba(233, 255, 249, 0.777)"], "rgb(141, 195, 187)", '5px', "[150, 150, 230, 150, 150]-150-.3"])
    let Yago2 = new Pessoa(`Yago`, [5, 199921610, 1], ``, `HYPER-MATRIX`, undefined, [["rgb(37, 255, 99)", "rgba(123, 255, 87, 1)", "rgba(92, 247, 255, 1)"], "rgba(83, 213, 159, 1)", '3px', "[90, 160, 90]-150-1"])

let Malu = new Pessoa(`Malu`, 200, `MALU -> UMA L`)
    let Malu1 = new Pessoa(`Malu`, 200000, `o passado é meu, o presente é do passado`, `Cronista Arcaica`, ["Flash me back - Camellia", "../Audios/FlashMeBack.mp3"], [["rgba(253, 255, 209, 1)", "rgba(156, 164, 96, 1)", "rgba(207, 194, 170, 1)"], "rgba(246, 249, 210, 1)", '3px', "[50, 30, 50, 50, 30, 30]-70-.4"]) // flash me back

let Raquel = new Pessoa(`Raquel`, 250, `Eu Tolero Minúsculo Em Outros Nomes, Mas Quando É No Meu, Eu Te Provo Quão Minúsculo É Você`)
    let Raquel1 = new Pessoa(`Raquel`, 100000, `"Deixe que eu levo seu português por você, não precisa de sua voz quando quiser gritar por resgate"`, `A Oradora silenciosa`, ["Blue Horizon Funk - NXGHT! & DJ ZAP", "../Audios/AmigaDaMinhaMulher.mp3"], [["rgb(141, 86, 54)", "rgba(232, 164, 105, 1)", "rgba(234, 173, 108, 1)"], "rgba(255, 186, 158, 0)", '4px', "[40, 70, 40]-130-2"]) // amiga da minha mulher

let Maria = new Pessoa(`Maria`, 400, `Ser de potência subestimada, mas gosta de um chocolate`)
    let Maria1 = new Pessoa(`Maria`, 7600, `CROOCS mortal, seu arremesso exala moral`, `CROOCS`, undefined, [["rgb(255, 221, 157)", "rgba(255, 128, 128, 1)", "rgba(255, 166, 128, 1)"], "rgba(255, 122, 122, 1)", '3px'])
    let Maria2 = new Pessoa(`Maria`, 1200000, `a loucura pode vir de não saber o que é o que foi`, `Mestra da Ilusão`, ["World's End BLACKBOX - DDDice", "../Audios/World'sEndBlackbox.mp3"], [["rgba(255, 0, 0, 0.808)", "rgba(255, 165, 100, 0.777)"], "rgba(255, 247, 189, 1)", '8px', "[360, 360, 400, 360]-240-1"]) //world's end blackbox

let Gibres = new Pessoa(`Gibres`, 500, ``, undefined, undefined, [["rgba(8, 0, 255, 1)", "rgba(8, 0, 255, 1)"], "rgba(120, 129, 151, 0.1)", '3px'])

let Thales = new Pessoa(`Thales`, 685, `Ainda bem que sabem que é mentira -2025`)
    let Thales1 = new Pessoa(`Thales`, [10, 3425, 1], `„Das Vergessen ist kein bloßes Visieren, kein bloßes Zurücklassen einer Vorstellung, sondern eine tätige, im strengsten Sinne positive Fähigkeit …“`, `DISFIGUREMENT`, undefined, [["rgba(227, 199, 255, 1)", "rgba(233, 161, 255, 1)", "rgba(186, 108, 250, 1)"], "rgba(139, 120, 151, 1)", '3px', "[290, 250, 290, 250, 290, 290]-90-.6"])
    let Thales2 = new Pessoa(`Thales`, 13700, `Beira Omniconciência`, `Mileto`, undefined, [["rgba(220, 220, 255, 1)", "rgba(249, 229, 255, 1)", "rgba(243, 221, 216, 1)"], "rgba(120, 129, 151, 1)", '3px'])

let Maycon = new Pessoa(`Maycon`, 1111, `verbo to be bado`)
    let Maycon1 = new Pessoa(`Maycon`, 83325, `SMT PT — SoMeThing PaTient — tem que saber inglês`, `Poliglota Sombrio`, undefined, [["rgba(255, 211, 211, 1)", "rgba(189, 212, 255, 1)", "rgba(255, 255, 255, 1)"], "rgba(97, 92, 132, 1)", '4px'])

let PedroGRANDE = new Pessoa(`PedroGRANDE`, 1275, `Ônibus é um lego`)
    let PedroGRANDE1 = new Pessoa(`PedroGRANDE`, [9, 1083700, 1], `"Fuma meteoro e sai nebulosas`, `Planet`, ["Galaxy Collapse - Kurokotei", "../Audios/GalaxyCollapse.mp3"], [["rgba(166, 0, 255, 0.808)", "rgba(250, 220, 255, 0.777)"], "rgba(115, 103, 173, 1)", undefined, "[210, 400, 210]-250-1"]) // galaxy collapse

let TARZAN = new Pessoa(`T A R Z A N`, [4, 1400, 7000], `êêêêêêêêê!!`, undefined, undefined, [["rgb(165, 210, 171)", "rgba(95, 255, 106, 1)"], `rgba(128, 173, 81, 0.83)`])
    let TARZAN1 = new Pessoa(`T A R Z A N`, [4, 1125000, 5625000], `versão bostil da mãe natureza`, `Pai Amazônia`, ["Aegleseeker - Frums & Silentroom", "../Audios/Aegleseeker.mp3"], [["rgb(165, 210, 171)", "rgb(212, 255, 95)"], "rgba(117, 150, 105, 0.83)", undefined, "[90, 60, 90]-240-1"]) // aegleseeker

let Arlan = new Pessoa(`Arlan`, [2, 1500, 15000], `hey gays- guys, para isso aí`)
    let Arlan1 = new Pessoa(`Arlan`, 52500, `me zoaram o suficiente já...`, `MoniDOR`, undefined, [["rgba(82, 94, 96, 1)", "rgba(139, 184, 193, 1)", "rgba(189, 219, 234, 1)"], "rgba(133, 153, 163, 1)"])

let Rafael = new Pessoa(`Rafael`, 1665, `Estou vendo gente morta!!`)
    let Rafael1 = new Pessoa(`Rafael`, [4, 66600, 999000], `'Meu segundO empRego, enTeudEu?'`, `NECROMANTE`, undefined, [["rgba(181, 45, 255, 1)", "rgba(85, 255, 0, 1)", "rgba(0, 255, 157, 1)"], "rgba(224, 255, 243, 1)"])

let Hebert = new Pessoa(`Hebert`, 2000, `ok, é A né? justifique então, faça isso para as outras 14`)
    let Hebert1 = new Pessoa(`Hebert`, 240000, `e essa placa tectõnica... um pouquinho para a esqueda. Perfeito!`, `Cartógrafo do caos`, ["Final blenderman appeared - Camellia", "../Audios/FinalBlendermanAppeared.mp3"], [["rgba(255, 163, 15, 1)", "rgba(216, 95, 95, 1)"], "rgba(249, 246, 235, 1)", '8px', "[350, 400, 350]-200-2"]) //final blenderman appeared
    let Hebert2 = new Pessoa(`Hebert`, 40002000, `O deus HISTÓRICO que carrega toda a GEOGRAFIA do planeta Terra`, `Atlas`,  ["Lament Rain - DDDice & Ashrount", "../Audios/LamentRain.mp3 "], [["rgb(255, 150, 150)", "rgba(169, 131, 88, 1)"], "rgba(99, 20, 255, 0)", undefined, "[380, 310, 380]-110-2"]) // lament rain

let Alcides = new Pessoa(`Alcides`, 3000, `sua praga é dilema, premissa e profecia`)
    let Alcides1 = new Pessoa(`Alcides`, 600000, `fabricando o canetão perfeito...`, `Alquimista Profano`, ["Dimnesion - Creo", "../Audios/Dimension.mp3"], [["rgba(83, 78, 90, 1)", "rgba(94, 82, 111, 1)", "rgba(130, 124, 146, 1)"], "rgba(190, 176, 196, 1)", undefined, "[200, 240, 300, 200]-50-3"]) //dimension

let Gigante = new Pessoa(`Gigante`, 4000, `o pequenot- gigante destruidor de cidades`, undefined, undefined, [["rgb(206, 209, 134)", "rgba(231, 255, 133, 1)", "rgba(255, 255, 229, 1)"], "rgba(96, 97, 76, 1)", '4px'])
    let Gigante1 = new Pessoa(`Gigante`, 80000000, ``, `Galaxy`, undefined, [["rgb(104, 132, 246)", "rgb(145, 72, 255)"], "rgba(226, 229, 255, 1)", undefined, "[230, 200, 230]-200-1"])

let QueroQuero = new Pessoa(`Quero-Quero`, [4, 5000, 80000], `poucos se atrevem mexer com ele`, undefined, undefined, [["rgba(0, 0, 0, 1)", "rgba(38, 32, 28, 1)", "rgba(210, 125, 86, 1)"], "rgba(225, 209, 199, 1)", '4px'])
    let QueroQuero1 = new Pessoa(`Quero-Quero`, 5000000, ``, `Phoenigarasu`, ["INVERSION - tn.shi", "../Audios/Inversion.mp3"], [["rgba(255, 59, 25, 1)", "rgba(255, 189, 102, 1)"], "rgba(254, 220, 160, 1)", undefined, "[360, 380, 360, 320, 360]-250-.4"])

let PomboGordo = new Pessoa(`PomboGordo`, [4, 27500, 687500], `é um pombo, é gordo, é um pombo gordo`, undefined, undefined, [["rgba(173, 173, 173, 1)", "rgba(191, 191, 191, 1)"], "rgba(138, 138, 138, 1)"])
    let PomboGordo1 = new Pessoa(`PomboGordo`, [9, 302500000, 605000000], ``, `Coosmos`,``, [["rgb(174, 175, 184)", "rgba(189, 202, 186, 1)", "rgba(216, 219, 243, 1)"], "rgba(163, 174, 169, 1)", "3px", "[180]-20-1"])

let TrinitédesGnomes = new Pessoa(`Trinité des Gnomes`, [4, 60000, 1800000], `A GRANDIOSA nação (Arthur, Pedro, Gigante)`, undefined, undefined,  [["rgb(32, 173, 79)", "rgba(51, 215, 204, 1)", "rgba(92, 247, 255, 1)"], "rgba(101, 66, 240, 1)"])
    let TrinitédesGnomes1 = new Pessoa(`Trinité des Gnomes`, [4, 12000000, 24000000], ``, `Quantum`, ``, [["rgb(102, 102, 102)", "rgb(255, 55, 55)"], "rgb(255, 144, 144)", undefined, "[355, 350, 355]-250-1"])

let Retroescavadeira = new Pessoa(`Retro Escavadeira`, 123321, `OLHA!, é uma R E T R O  E S C A V A D E I R A`, undefined, undefined, [["rgb(255, 144, 26)", "rgba(255, 242, 0, 1)", "rgba(255, 242, 0, 1)"], "rgba(255, 181, 107, 1)", '4px', "[40]-300-1"])

let Teste = new Shop(`PATO`, [1.5, 1.5, 1.5],
    {Arthur: 1}
    , 150)
let Teste1 = new Shop(`PAaTdO`, [1.5, 1.5, 1.5],
    {Marcella: 2}
    , 150)
document.querySelector(`#audio-list`).innerHTML = Object.entries(Pessoa.audio).reduce((acc, [id, src]) => {
    acc.push(`<audio id="${id}" src="${src}" loop></audio>`)
    return acc
}, []).join("")
}

let blockList = [];
let sellQuantity = 1; 
let pulsePoint = 1; let secPulsePoint = 1;
let displayedElement; let displayedColElement; let inventoryDisplay = false; let collectionDisplay = false; let havanDisplay = false; let elementClick;
let picked; let active = false;
let baseLuck = 1; let biome = 0; let baseSpeed = 1; let baseFortune = 0; fortuneCount = 10; let baseBiome;
let appliedColor = []; let appliedSat = 150; duration = 10
let AudioPlaying = '';
let musicSvg = `<svg class="musicSvg" width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="main-color" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="hsla(0, 71%, 75%, 1.00)"/>
            <stop offset="100%" stop-color="hsla(25, 64%, 68%, 1.00)"/>
        </linearGradient>
    </defs>
    
    <rect width="27" height="23" rx="5" fill="url(#main-color)"/>
    <path d="M13.9043 20.1982L5.02441 15.3408L5.03516 15.334C3.55116 14.5934 2.53125 13.0613 2.53125 11.29C2.5313 9.51862 3.55093 7.98563 5.03516 7.24512L5.02441 7.23926L13.9043 2.38184V20.1982Z" fill="#ffffff"/>
    <path d="M15.7744 2.41006C20.6851 2.38787 24.6934 6.34101 24.7344 11.2558C24.7753 16.182 20.8142 20.2089 15.8877 20.2499C15.8499 20.2502 15.8121 20.2481 15.7744 20.248V18.3817L15.7773 18.3827C19.6924 18.3827 22.8662 15.244 22.8662 11.372C22.8662 7.49995 19.6924 4.36124 15.7773 4.36124H15.7744V2.41006Z" fill="#ffffff"/>
    <path d="M15.7744 6.61719C18.5347 6.65834 20.7597 8.87295 20.7598 11.6006C20.7596 14.3282 18.5347 16.5419 15.7744 16.583V14.5586C17.4161 14.5182 18.7342 13.2098 18.7344 11.6006C18.7343 9.9913 17.4161 8.68301 15.7744 8.64258V6.61719Z" fill="#ffffff"/>
    </svg>`
let rolls = 0; let exp = 10;
let level = 1; 
let equipped = undefined; let shopEquipped;
let time = 100
let levelBlock = false;
let rolling = false;
let biomes = {
    0: '200-500',
    1: '180-650',
    2: '160-600',
    3: '140-750',
    4: '155-800',
    5: '50-1200',
    6: '80-1350',
    7: '70-1100',
    8: '300-1500',
    9: '400-3500',
    10: '18-18000'
}

biomeLoop()
colorLoop()

centerUpdate()
icdEmptyUpdate()
updateCollection()
centerUpdate()
updateShop()

console.log(Pessoa.values)
document.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`#roll`).addEventListener(`click`, () => {
        if(rolling){ return }
        rolling = true;
        rolls++;
        document.querySelector(`#center-desc`).innerHTML = ``
        document.documentElement.style.setProperty(`--stop1`, `hsl(10, 30.90%, 78.40%)`)
        document.documentElement.style.setProperty(`--stop2`, `hsl(10, 31.80%, 69.40%)`)
        document.documentElement.style.setProperty(`--stroke`, `hsl(10, 31.30%, 93.90%)`)
        document.documentElement.style.setProperty(`--strokepx`, '2px')
        document.documentElement.style.setProperty(`--fill-type`, `url(#main)`)

        let jump = function(selector, measure){
            gsap.timeline().set(selector, {
                y: (-measure),
            }).to(selector, {
                y: (-measure - 6),
                ease: `power2.out`,
                duration: 0.2
            }).to(selector, {
                y: (-measure),
                ease: `power2.in`,
                duration: 0.3
            })
        }
        active = true;
        for(let i = 0; i < 11; i++){
            setTimeout(() => {
                if(fortuneCount === 0){
                    picked = Pessoa.roll(String(Number(luck) + fortune), biome, true)
                }
                else{
                    picked = Pessoa.roll(luck, biome, true)
                }
                picked = [picked[0].acronym, picked[1], false]
                
                center(picked)
                jump(`#center-name`, 75)
                setTimeout(() => jump(`#center-rariety`, 50), 40)
                document.querySelector(`#center-new`).innerHTML = ``
            }, (25*i**2 + 25*i - 50) / speed)
        }
        
        setTimeout(() => {
            active = false;
            updateInventory(true)
            updateCollection()
            displaycol(displayedColElement)
            jump(`#center-name`, 75)
            setTimeout(() => jump(`#center-rariety`, 50), 40)
            selected = Pessoa.values[Pessoa.values.findIndex((ele) => {return ele.acronym === picked[0]})]
            if(selected.fontColors === undefined){
                document.documentElement.style.setProperty(`--stop1`, `hsl(8, 40%, 50%)`)
                document.documentElement.style.setProperty(`--stop2`, `hsl(28, 40%, 90%)`)
                document.documentElement.style.setProperty(`--stroke`, `hsl(1, 30%, 50%)`)
            }
            else{
                if(selected.fontColors.length === 2){
                    document.documentElement.style.setProperty(`--fill-type`, `url(#main)`)
                    document.documentElement.style.setProperty(`--stop1`, selected.fontColors[0])
                    document.documentElement.style.setProperty(`--stop2`, selected.fontColors[1])
                }
                else{
                    document.documentElement.style.setProperty(`--fill-type`, `url(#sec)`)
                    document.documentElement.style.setProperty(`--stop3`, selected.fontColors[0])
                    document.documentElement.style.setProperty(`--stop4`, selected.fontColors[1])
                    document.documentElement.style.setProperty(`--stop5`, selected.fontColors[2])
                }
                document.documentElement.style.setProperty(`--stroke`, selected.stroke)
                if(selected.strokepx !== undefined){
                    document.documentElement.style.setProperty(`--stroke`, selected.stroke)
                    document.documentElement.style.setProperty(`--strokepx`, selected.strokepx)
                }
            }
            rolling = false;
            if(exp === rolls){
                rolls = 0; exp += 5; level++;
            }
            if(fortune !== 0){
                fortuneCount--
                if(fortuneCount === -1){
                    fortuneCount = 10
                }
            }
            centerUpdate()
            document.querySelector(`#level-number`).innerHTML = `<span>LV ${level}</span> <span>${rolls} / ${exp}</span>`
            document.querySelector(`#level-bar`).style = `width: ${10 + (290 / exp) * rolls}px`
        }, 3800 / speed)
    })
})
document.querySelector(`#inv-dropdown`).addEventListener(`click`, () => {
    if(!inventoryDisplay){
        gsap.to(`#inventory-content, #painels`, {
            x: -700,
            duration: 0.2,
            onComplete: () => {
                inventoryDisplay = true;
            }

        })
        return false
    }
     gsap.to(`#inventory-content, #painels`, {
        x: 0,
        duration: 0.2,
        ease: `power2.out`
    })
    inventoryDisplay = false;
})
document.querySelector(`#collection-dropdown`).addEventListener(`click`, () => {
    if(!collectionDisplay){
        gsap.to(`#collection-content, #col-painels`, {
            x: 700,
            duration: 0.2,
            onComplete: () => {
                collectionDisplay = true;
            }

        })
        return false
    }
    gsap.to(`#collection-content, #col-painels`, {
        x: 0,
        duration: 0.2,
        ease: `power2.out`
    })
    collectionDisplay = false;
})
document.querySelector(`#havan-btn`).addEventListener(`click`, () => {
    if(!havanDisplay){
        return false
    }
})
document.addEventListener(`mousemove`, (e) => {
    elementClick = document.elementFromPoint(e.clientX, e.clientY)
})
document.querySelector(`#main-def`).innerHTML = `<linearGradient id="def" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="10%" stop-color="hsl(8, 40%, 50%)"/><stop offset="50%" stop-color="hsl(28, 40%, 90%)"/><stop offset="90%" stop-color="hsl(1, 30%, 50%)"/></linearGradient>
${Pessoa.values.reduce((acc, ele) => {
    if(ele.fontColors){
        if(ele.fontColors.length === 2){
            acc += `
<linearGradient id="${ele.acronym}" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="${ele.fontColors[0]}"/><stop offset="100%" stop-color="${ele.fontColors[1]}"/></linearGradient>`
        }
        else{
            acc += `
<linearGradient id="${ele.acronym}" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="10%" stop-color="${ele.fontColors[0]}"/><stop offset="50%" stop-color="${ele.fontColors[1]}"/><stop offset="90%" stop-color="${ele.fontColors[2]}"/></linearGradient>`
        }
    }
    return acc
}, '')}`
document.addEventListener(`click`, () => {
    let blur = document.querySelector(`#blurback`)
    let havan = document.querySelector(`#border-wrap`)
    if(havanDisplay){
        if(!elementClick.matches(`#border-wrap, .deposit-btn, .buy-btn, #havan`)){
            havanDisplay = false;
            blur.style = `display: none;`
            havan.style = `display: none`
        }
    }
    else{
        if(elementClick.matches(`#havan-btn`) || elementClick.matches(`#blurback`)){
            let blur = document.querySelector(`#blurback`)
            let havan = document.querySelector(`#border-wrap`)
            blur.style = `display: block;`
            havan.style = `display: block`
            havanDisplay = true;
        }
    }
})
function updateCollection(){
    document.querySelector(`.collection-block`).innerHTML = Pessoa.values.reduce((acc, ele) => {
        if(ele.isCollected){
            acc += `
            <div onclick="displaycol('${ele.acronym}')" class="col-ele">
                <span class="col-ele-text" style="font-size: 13px">${ele.fullName}</span>
                <span class="text-small col-ele-text">1 in ${ele.least}</span>
                <span class="col-ele-desc" style="position: absolute">${ele.description}</span>
            </div>`;
        }
        else{
            acc += `
            <div class="col-ele-block">
                <span style="font-size: 13px">???</span>
                <span class="text-small">1 in ???<span>
            </div>`;
        }
        return acc
    }, '')
}
function pieceUpdateInventory(){
    let blockList = Pessoa.inventory.reduce((acc, [name, quantity]) => {
        acc.push(
            `<span onclick="display('${name.acronym}')" class="inv-ele" data-id="inv-${name.acronym}">
                <pre>
<span class="preElement" style="font-size: 13px;">${name.name}</span>
${name.isMutation ? `<span class="preElement" style="font-size: 12px; display: inline-block; transform: translateY(-3px);">(${name.mutation})</span><br>`: ""}1 in ${name.least}
                
                </pre>
                ${name.least > 100 ? name.type === 0 ? `<svg class="inv-svg" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 0C24.7614 1.28851e-07 27 2.23858 27 5V22C27 24.7614 24.7614 27 22 27H5C2.23858 27 0 24.7614 0 22V5C1.28855e-07 2.23858 2.23858 0 5 0H22ZM18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16ZM8.5 6C7.11929 6 6 7.11929 6 8.5C6 9.88071 7.11929 11 8.5 11C9.88071 11 11 9.88071 11 8.5C11 7.11929 9.88071 6 8.5 6Z" fill="#e18871ff"/>
                </svg>` : name.type === 1 ? `<svg class="inv-svg" width="31" height="27" viewBox="0 0 31 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 27L9 13L0 0H6L15 13L6 27H0Z" fill="#e18871ff"/>
                    <path d="M8 27L17 13L8 0H14L23 13L14 27H8Z" fill="#e18871ff"/>
                    <path d="M16 27L25 13L16 0H22L31 13L22 27H16Z" fill="#e18871ff"/>
                </svg>` :`<svg class="inv-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.2492 0.000343889C10.8662 -0.0138257 12.8784 0.787633 13.632 1.85484L13.7433 1.74448L13.8976 1.89878C14.9016 0.401274 18.3972 -0.595362 19.8957 0.403664C21.395 1.40351 22.5938 4.20153 19.3986 7.39976L19.3996 7.40073L13.7433 13.058L8.08611 7.40073L8.1076 7.3773C8.09301 7.38465 8.07908 7.39351 8.06463 7.40073C4.86519 4.20097 6.06473 1.40078 7.56463 0.400735C7.99619 0.113019 8.5937 -0.00732944 9.2492 0.000343889Z" fill="#e18871ff"/>
                    <path d="M19.3995 20.058L19.3975 20.0589C22.5935 23.2576 21.3941 26.0554 19.8946 27.055C18.3957 28.0541 14.8996 27.057 13.8966 25.5589L13.7423 25.7142L13.6309 25.6029C12.8769 26.671 10.8629 27.4738 9.24521 27.4584C8.59118 27.4655 7.99529 27.3451 7.56454 27.058C6.06458 26.058 4.86491 23.2578 8.06454 20.058C8.07917 20.0653 8.09371 20.073 8.10849 20.0804L8.08603 20.058L13.7423 14.4007L19.3995 20.058Z" fill="#e18871ff"/>
                    <path d="M0.000342146 18.2094C-0.0138118 16.5926 0.788726 14.5813 1.85579 13.8276L1.74446 13.7153L1.89876 13.561C0.401575 12.5566 -0.594154 9.06232 0.404589 7.56389C1.40423 6.06444 4.20116 4.86536 7.39971 8.06093L7.40166 8.05898L13.0589 13.7152L7.40171 19.3725L7.37828 19.351C7.38562 19.3655 7.3945 19.3795 7.40171 19.3939C4.20196 22.5935 1.40183 21.3938 0.401717 19.894C0.113992 19.4624 -0.00733505 18.8649 0.000342146 18.2094Z" fill="#e18871ff"/>
                    <path d="M20.0586 8.05995L20.0586 8.06092C23.2572 4.86482 26.0559 6.06437 27.0557 7.56382C28.0549 9.06259 27.0575 12.5586 25.5596 13.5619L25.7149 13.7162L25.6036 13.8275C26.6719 14.5815 27.4746 16.5963 27.459 18.2142C27.4662 18.8679 27.3456 19.4633 27.0587 19.8939C26.0587 21.3939 23.2587 22.5939 20.0587 19.3939C20.0657 19.3799 20.073 19.3661 20.0801 19.3519L20.0587 19.3734L14.4014 13.7162L20.0586 8.05995Z" fill="#e18871ff"/>
                </svg>` : ``}
                ${name.least >= 100000 ? `<span class="musicSpan"><span class="musicSpan-hitbox" onclick="audioPlay('${name.acronym}')"></span>${musicSvg}</span>`: ``}
                <span id="quantity">x${quantity}</span>
            </span>`)
            return acc
        }, [])
    return blockList
}
function icdEmptyUpdate(){
     if(!Pessoa.inventory.some(([ele]) => {
         return ele.acronym === displayedElement
     })){
        gsap.to(`#empty-text`, {
            opacity: 1,
            duration: 0.2
        })
        gsap.to(`#icd-info-div *, #icd-btn-div *`, {
            opacity: 0,
            duration: 0.2
        })
        textSerie([["icd-text-name", "name"], ["icd-text-rariety", "rariety"]])
    }
    else{
        gsap.to(`#empty-text`, {
            opacity: 0,
            duration: 0.2
        })
        gsap.to(`#icd-info-div *, #icd-btn-div *`, {
           opacity: 1,
            duration: 0.2
        })
    }
}
function shift(){
    levelBlock = levelBlock ? false : true
    centerUpdate()
}
function centerUpdate(){
    let typeName
    let biomeName
    let selected
    if(equipped){
        switch(Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === equipped)].type){
            case 0:
                typeName = 'luck'
                break;
            case 1:
                typeName = 'speed'
                break;
            case 2:
                typeName = 'fortune'
                break;
        }
        selected = Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === equipped)]
    }
    switch(biome){
        case 0: biomeName = 'Sala'; break
        case 1: biomeName = 'Pátio'; break
        case 2: biomeName = 'Refeitório'; break
        case 3: biomeName = 'Campinho'; break
        case 4: biomeName = 'Jardim Ingá'; break
        case 5: biomeName = 'Co-working'; break
        case 6: biomeName = 'PJ macumba'; break
        case 7: biomeName = 'Xique-Xique'; break
        case 8: biomeName = 'Concepções'; break
        case 9: biomeName = 'Cometa negro'; break
        case 10: biomeName = 'Abyssolute'; break
    }
    let shop = Shop.values[Shop.values.findIndex((ele) => ele.acronym === shopEquipped)]
    document.querySelector(`#center-boost-list`).innerHTML = `
        <span class="level-cbl cbl-ele ${levelBlock ? `blocked` : ``}" onclick="shift()">
            <span>Level</span>
            <span> [${(Math.log(level) / Math.log(100)).toFixed(2)}] <br> luck</span>
        </span>
        ${equipped ? `
        <span class="cbl-ele">
            <span>${equipped.toUpperCase()}</span>
            <span>[${selected.boost[0]}] <br> ${typeName}</span>
        </span>
            ` : ""}
        ${shopEquipped ? 
        `<span class="cbl-ele">
            <span>${shopEquipped}</span>
            <span> L: ${shop.luckAttr}<br> F: ${shop.fortuneAttr}<br> S: ${shop.speedAttr} </span>
        </span>`: ``}
        
    `   
    selected = Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === equipped)]
    let selectedShop = Shop.values[Shop.values.findIndex((ele) => ele.acronym === shopEquipped)]
    if(baseBiome){ biome = baseBiome}
    luck = baseLuck
    speed = baseSpeed;
    fortune = baseFortune
    if(!levelBlock) luck += Number((Math.log(level) / Math.log(100)).toFixed(2))
    if(equipped) if(selected.boost[1] === 0) luck += Number(selected.boost[0]); luck = luck.toFixed(2)
    if(equipped) if(selected.boost[1] === 1) speed += Number(selected.boost[0]);
    if(equipped) if(selected.boost[1] === 2) fortune += Number(selected.boost[0]);
    if(shopEquipped) luck = Number(luck) + Number(selectedShop.luckAttr)
    if(shopEquipped) speed += Number(selectedShop.speedAttr)
    if(shopEquipped) fortune += Number(selectedShop.fortuneAttr)

    document.querySelector("#boost-list-info").innerHTML =
    `L : ${luck} | F : ${fortune} | S : ${speed} | money : ${Pessoa.money} | biome : ${biome} (${biomeName})`
    if(fortune !== 0){
        if(fortuneCount === 0){
            document.querySelector(`#center-fort`).innerHTML = `FORTUNE ROLL`
        }
        else{
            document.querySelector(`#center-fort`).innerHTML = `${fortuneCount} rolls`
        }
    }
    else{
        document.querySelector(`#center-fort`).innerHTML = ``
    }
}
function updateInventory(main){
    let elementList = Array.from(document.querySelector(`.inventory-block`).children)
    let rolled
    if(fortuneCount === 0){
        rolled = Pessoa.roll(String(Number(luck) + fortune), biome);
    }
    else{
        rolled = Pessoa.roll(luck, biome);
    }
    let blockList = pieceUpdateInventory()
    let position = new Map
    elementList.forEach((ele) => {
        position.set(ele.dataset.id, ele.getBoundingClientRect())
    })
    document.querySelector(`.inventory-block`).innerHTML = blockList.join("")
    if(main){
        picked = [rolled[0].acronym, rolled[1], true]
        center(picked)
        if(!rolled[2]){
            document.querySelector(`#center-new`).innerHTML = `NEW`
            gsap.fromTo(`#center-new`, {
                color: `yellow`
            }, {
                color: `#00ff00`
            })
        }
    }    
    requestAnimationFrame(() => {
        let newList = Array.from(document.querySelector(`.inventory-block`).children)
            newList.forEach((ele) => {
            if(position.get(ele.dataset.id)){
                gsap.fromTo(ele, {
                    x: position.get(ele.dataset.id).x - ele.getBoundingClientRect().x,
                    y: position.get(ele.dataset.id).y - ele.getBoundingClientRect().y
                }, {
                    ease: 'power2.out',
                    x: 0,
                    y: 0,
                    duration: 0.3 / Math.max(speed, 3) 
                })
            }
            else{
                gsap.set(ele, {scale: 0})
                gsap.to(ele, {scale: 1, duration: 0.2})
            }
            if(ele.dataset.id === `inv-${rolled[0].acronym}`){
                gsap.from(`[data-id="inv-${ele.dataset.id.split(`-`)[1]}"]`, {
                    backgroundColor: `hsla(30, 71%, 75%, 1.00)`,
                    clearProps: `backgroundColor`
                })
                if(displayedElement === ele.dataset.id.split("-")[1]){
                    display(ele.dataset.id.split("-")[1])
                }
            }
        })
    })
}
function display(id){
    if(elementClick.matches(`#sell-type-grid`) || elementClick.matches(`#auto-type-grid`)){ return false;}
    const name = Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === id)]
    let quantity = Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === id)]
    if(!quantity){
        quantity = 0;
    }
    else{
        quantity = quantity[1];
    }
    if(secPulsePoint === 3){
        if(!elementClick.matches(`#roll`) && !elementClick.matches(`#name-svg`) && !elementClick.matches(`.sell-methods`)){
            if(name.least > 100){
                equip(id)
            }
            return false;
        }
    }
    if(secPulsePoint === 2){ 
        if(!elementClick.matches(`#roll`) && !elementClick.matches(`#name-svg`) && !elementClick.matches(`.sell-methods`)){
            Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === name.acronym)][1] = Math.max(quantity - sellQuantity, 0)
            Pessoa.money += (quantity - Math.max(quantity - sellQuantity, 0)) * name.price
            sellUpdateInventory(id)
            icdEmptyUpdate()
            centerUpdate()
            updateShop()
            return false;
        }
    }
    document.querySelector(`#icd-btn-div`).innerHTML = `<button id="sell-btn">Sell</button> ${name.least > 100 ? `<button id="equip-btn">Equip</button> <span class="text-small">${`${name.boost[0]}x on ${name.boost[1] == 0 ? "Luck" : name.boost[1] == 1 ? "speed" : "fortune" }`}</button>` : ``}`
    displayedElement = id
    textSerie([
        [`icd-text-name`, name.fullName], 
        [`icd-text-rariety`, `1 in ${name.least}`],
        [`icd-sell-each`, `cada: ${name.price}R$`],
        [`icd-sell-total`, `total: ${name.priceTotal}R$`],
        [`icd-sell-calc1`, `(${quantity} * ${name.price}R$)`], 
        [`icd-sell-esti`, `${(quantity - Math.max(quantity - sellQuantity, 0)) * name.price}R$`],
        [`icd-sell-calc2`, `(${(quantity - Math.max(quantity - sellQuantity, 0))} * ${name.price}R$)`]
    ])
    document.querySelector(`#sell-btn`).onclick = () => {
        if(Pessoa.inventory.some((ele) => {return ele[0].acronym === displayedElement})){
            Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === name.acronym)][1] = Math.max(quantity - sellQuantity, 0)
            Pessoa.money += (quantity - Math.max(quantity - sellQuantity, 0)) * name.price
            display(id)
            sellUpdateInventory(id)
            icdEmptyUpdate()
            
            if(!Pessoa.inventory.some(([obj]) => {
                return obj.acronym === equipped
            })){
                appliedColor = [0]
                appliedSat = 150
                duration = 1
                equipped = undefined;
            }
            centerUpdate()
        }
    }
    if(document.querySelector(`#equip-btn`)){
        document.querySelector(`#equip-btn`).onclick = () => {
            if(Pessoa.inventory.some((ele) => {return ele[0].acronym === displayedElement})){
                equip(id)
            }
        }
        if(displayedElement !== equipped){
            document.querySelector(`#equip-btn`).innerHTML = `Equip`
        }
        else document.querySelector(`#equip-btn`).innerHTML = `Undo`
    }   
    icdEmptyUpdate()

}
function equip(id){
    let person = Pessoa.values[Pessoa.values.findIndex((ele) => {return ele.acronym === id})]
    if(person.least < 100) return
    if(id === equipped){
        document.querySelector(`#equip-btn`).innerHTML = `Equip`
        appliedColor = [0]
        appliedSat = 150
        duration = 1
        equipped = undefined
        centerUpdate()
    }
    else{
        document.querySelector(`#equip-btn`).innerHTML = `Undo`
        if(person.painelColors){
            appliedColor = JSON.parse(person.painelColors.split('-')[0])
            appliedSat = Number(person.painelColors.split('-')[1])
            duration = Number(person.painelColors.split('-')[2])
        }
        else{
            appliedColor = [0]
            appliedSat = 150
            duration = 1         
        }
        equipped = id
        fortuneCount = 10;
        centerUpdate()
    }
    audioPlay(id)
}
function displaycol(id){
    if(!id) return;
    gsap.to(`#ccd-empty-text`, {
        opacity: 0
    })
    let selected = Pessoa.values[Pessoa.values.findIndex((ele) => { return ele.acronym === id })]
    let quantity = Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === id)]
    let collectQuantity = Pessoa.collection[Pessoa.collection.findIndex(([obj]) => obj.acronym === id)]
    if(!quantity) quantity = 0;
    else quantity = quantity[1];
    if(!collectQuantity) collectQuantity = 0;
    else collectQuantity = collectQuantity[1];
    let L = .6
    displayedColElement = id
    if(selected.fontColors !== undefined){
        L = selected.fontColors.reduce((acc, ele) => {
            ele = ele.replace('rgb', '').replace('a', '').replace('(', '[').replace(')', ']')
            ele = JSON.parse(ele).slice(0, 3)
            acc.push(ele)
            return acc
        }, []).reduce((acc, ele) => {
           ele = ele.map((ele) => {
                return (ele/255) ** 2.2
           }).map((ele, ind) => {
                switch(ind){
                    case 0: return ele * 0.2126; break;
                    case 1: return ele * 0.7152; break;
                    case 2: return ele * 0.0722; break;
                }
           })
           ele = ele.reduce((acc, ele) => {
                acc += ele
                return acc
           }, 0)
           acc += ele;
           return acc
        }, 0) / selected.fontColors.length
    }
    document.querySelector(`#col-cd-title`).style.backgroundColor = (L + 0.05) / .23 > 3 ? "" : "hsla(10, 100%, 69%, 0.418)"
    document.querySelector(`#col-cd-title`).style.border = (L + 0.05) / .23 > 3 ? "" : "2px dashed hsla(14, 100%, 50%, 0.233)"

    let buttonList = Pessoa.values.reduce((acc, ele) => {
        if(ele.name === selected.name && ele.fullName !== selected.fullName) acc.push(`
            <button ${ele.isCollected ? `onclick="displaycol('${ele.acronym}')"` : ""}>
                ${ele.isCollected ? "" :
                `<svg style="position: absolute; transform: translate(0px, -5px)"width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="11" width="25" height="19" rx="5" fill="hsl(10, 51%, 70%)"/>
                    <path d="M12.5 0C17.1944 0 21 3.80558 21 8.5C21 8.66787 20.994 8.83454 20.9844 9H21V18H4V9H4.01562C4.00603 8.83454 4 8.66787 4 8.5C4 3.80558 7.80558 0 12.5 0ZM12.5 3C10.1838 3 8.27708 4.75007 8.02832 7H8V16H17V7H16.9717C16.7229 4.75007 14.8162 3 12.5 3Z" fill="hsl(10, 51%, 70%)""/>
                </svg>`}
                <span style="text-align: center;">${ele.acronym}</span>
            </button>`)
        return acc
    }, []).join("<br>")
    
    switch(selected.type){
        case 0: typeName = "luck"; break;
        case 1: typeName = "speed"; break
        case 2: typeName = "fortune"; break;
    }

    document.querySelector(`#ccd-griddiv-A`).innerHTML = `
        <span class="text-small">${selected.isSpecial ? "special" : selected.isBreakthrough ? "breakthrough" : "normal"}<br></span>
        <span class="text-small">x${quantity}<br></span>
        <span class="text-small">xX${collectQuantity}</span><br>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0ZM15 5C9.47715 5 5 9.47715 5 15C5 20.5228 9.47715 25 15 25C20.5228 25 25 20.5228 25 15C25 9.47715 20.5228 5 15 5Z" fill="${selected.collectSet.min ? "#ffafaf" : "#c18472ff"}"/>
            ${selected.isBreakthrough && !selected.isSpecial ? `<circle cx="15" cy="15" r="4" fill="${selected.collectSet.max ? "#ffafaf" : "#c18472ff"}"/>` : ""}
        </svg> <br>
        ${selected.least > 100 ? "<span>boost:": ""} <br>
        ${selected.least > 100 ? `[${selected.boost[0]}]` : ""} <br>
        ${selected.least > 100 ? `<span class="text-small">${typeName}</span>`: ""}
    `
    document.querySelector(`#ccd-griddiv-B`).innerHTML = buttonList

    document.querySelector(`#ccd-griddiv-C`).innerHTML = `
        <span>1 in ${selected.most}</span>
        ${(selected.isBreakthrough && !selected.isSpecial) ?
             `<span>1 in ${selected.least}<br> 
             <span class="text-small"> best biome: ${selected.biome}</span>
             </span>` :

             (selected.isSpecial) ? 
                `<span class="text-small"> exclusive biome: ${selected.biome} </span>` :

                ""}<br>
        <span>cada: ${selected.price}R$<br>
        <span>total: ${selected.price * selected.quantity}R$
    `
    document.querySelector(`#ccd-griddiv-D`).innerHTML = `
        <span style="font-size: 10px;"> Music: ${selected.audio ? selected.audio[0].split('-')[0] : "NONE"}<br></span>
        <span class="text-small"> Author: ${selected.audio ? selected.audio[0].split('-')[1] : "NONE"}</span>
    `
    document.querySelector(`#col-svg`).innerHTML = `
    <text ${selected.fontColors !== undefined ? `fill="url(#${selected.acronym})"}` : `fill="url(#def)"`} stroke="${(L + 0.05) / .23 > 2.5 ? "hsla(11, 18%, 38%, 1.00)": "hsla(0, 0%, 100%, 1.00)"}" stroke-width="1.5px" id="col-text"  paint-order="stroke fill" stroke-linejoin="round" dominant-baseline="middle"><tspan class="${selected.acronym}" style="font-size: 0.8em">${selected.fullName}</tspan></text>`
    document.querySelector(`#col-text`).style = `transform: translate(-2px, -3px) scale(${Math.min(2, 180 / document.querySelector(`#col-text`).getComputedTextLength())})`
}
function sellUpdateInventory(id){
    if(id === AudioPlaying){
        audioPlay(id)
    }
    let verification
    if(id){
        verification = (Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === id)])
        verification = verification.quantity !== 0
    }
    Pessoa.inventory = Pessoa.inventory.map(([o]) => [o, o.quantity])
    Pessoa.inventory = Pessoa.inventory.filter(([obj]) => obj.quantity !== 0)
    if(equipped && Pessoa.inventory.findIndex((ele) => ele[0].acronym === equipped) === -1){
        equip(equipped)
        centerUpdate()
    }
    if(!verification){
        gsap.to(`[data-id="inv-${id}"]`, {
            opacity: 0,
            scale: 0,
            ease: `back.out(1.7)`,
        })
        setTimeout(() => {
            let position = new Map
            let blockList = pieceUpdateInventory()
            let elementList = Array.from(document.querySelector(`.inventory-block`).children)
            elementList.forEach((ele) => {
                if(ele.dataset.id !== id){
                    position.set(ele.dataset.id, ele.getBoundingClientRect())
                }
            })
            document.querySelector(`.inventory-block`).innerHTML = blockList.join("")
            let newList = Array.from(document.querySelector(`.inventory-block`).children)
            newList.forEach((ele) => {
                if(position.get(ele.dataset.id)){
                    gsap.fromTo(ele, {
                        x: position.get(ele.dataset.id).x - ele.getBoundingClientRect().x,
                        y: position.get(ele.dataset.id).y - ele.getBoundingClientRect().y
                    }, {
                        ease: 'power2.out',
                        x: 0,
                        y: 0,
                        duration: 0.15
                    })
                }
            })
            return false;
        }, 100)
    }
    else{
        let blockList = pieceUpdateInventory()
        document.querySelector(`.inventory-block`).innerHTML = blockList.join("")
    }
}
function textSerie(list){
    list.forEach(([id, text]) => {
        document.getElementById(id).textContent = text
    })
}
function changeQuantity(number){
    sellQuantity = [1, 10, 100, 999999][number - 1];
    pulsePoint = number
    if(Pessoa.inventory.some((ele) => {return ele[0].acronym === displayedElement})){
        display(displayedElement)
    }
}
function changeMethod(number){
    secPulsePoint = number
}
function audioPlay(id){
    AudioPlaying = Object.entries(Pessoa.audio).reduce((acc, [ide]) => {
        const audioElement = document.querySelector(`#${ide}`)
        if(ide.split("aud")[0] !== id){
            audioElement.pause()
            AudioPlaying = ''
            audioElement.currentTime = 0
        }
        else{
            if(document.querySelector(`#${ide}`).currentTime !== 0){
                audioElement.pause()
                audioElement.currentTime = 0
                AudioPlaying = '';
            }
            else{
                acc = id
                audioElement.play()
                audioElement.currentTime = 0
            }
        }
        return acc
    }, '')

}
function hash(string){
    if(!active) return string;
    string = String(string)
    let japaneseList = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも'
    let random = Array.from(string).reduce((acc) => {
        acc += japaneseList.at(Math.floor(Math.random() * japaneseList.length))
        return acc
    }, '')
    random = Array.from(random).map(char => {
        return `<span style="display: inline-block; font-size: 10px; text-align: center;">${char}</span>`
    }).join("")
    return random
}
function center([acronym, breakthrough, truth]){
    if(picked !== undefined){
        let selected = Pessoa.values[Pessoa.values.findIndex((ele) => {return ele.acronym === acronym})]
        document.querySelector(`#center-name`).innerHTML = (selected.isMutation ? selected.mutation : selected.name)
        document.querySelector(`#center-rariety`).innerHTML = `1 em ${hash(selected.least)}`
        document.querySelector(`#center-name`).classList.replace(document.querySelector(`#center-name`).classList.value, selected.acronym)

        if(truth){
            document.querySelector(`#center-name`).innerHTML = selected.fullName
            document.querySelector(`#center-desc`).innerHTML = selected.description
            if(typeof breakthrough === 'object'){ breakthrough = breakthrough[3]}
            if(breakthrough){
                document.querySelector(`#center-rariety`).innerHTML = `1 em ${selected.most}`
                document.querySelector(`#center-break`).innerHTML = `Breakthrough from ${selected.least}`
            }
            else{
                document.querySelector(`#center-rariety`).innerHTML = `1 em ${selected.least}`
                if(selected.isSpecial){
                     document.querySelector(`#center-break`).innerHTML = `Exclusive from this biome`
                }
            }
        }
        else{
            document.querySelector(`#center-break`).innerHTML = ``
        }
    }
}
function colorLoop(){
    setTimeout(() => {
        if(appliedColor){
            for(let i = 0; i < appliedColor.length; i++){
                setTimeout(() => {
                    if(i === 0){
                        gsap.set(`:root`, {
                            "--hue": `${appliedColor[i]}deg`,
                        })
                    }
                    else{
                        gsap.to(`:root`, {
                            "--hue": `${appliedColor[i]}deg`,
                            duration: duration
                        })
                    }
                }, i * 200 * duration)
            }
        }
        colorLoop()
    }, appliedColor.length * 200 * duration)
}
setInterval(() => {
    gsap.fromTo(`#sell-type-grid > :nth-child(${pulsePoint})`, {
        backgroundColor: `hsla(17, 100%, 91%, 1.00)`,
    }, {
        backgroundColor: `hsla(10, 100%, 69%, 0.418)`,
        duration: 1
    })
    gsap.fromTo(`#auto-type-grid > :nth-child(${secPulsePoint})`, {
        backgroundColor: `hsla(17, 100%, 91%, 1.00)`,
    }, {
        backgroundColor: `hsla(10, 100%, 69%, 0.418)`, 
        duration: 1
    })
}, 300)
setInterval(() => {
    let windowsH = window.innerHeight
    let windowsW = window.innerWidth
    let inventoryH = document.querySelector(`#inventory-content`).getBoundingClientRect().height
    let inventoryW = document.querySelector(`#inventory-content`).getBoundingClientRect().width
    const inventoryC = document.querySelector(`#inventory-content`)
    const collectionC = document.querySelector(`#collection-content`)

    let inventory = inventoryH / gsap.getProperty('#inventory-content', 'scale')
    scale = Math.min(((windowsH - 18.81) / (inventory)), (windowsW / inventoryW  / 2))
    gsap.to(`#inventory-content, #collection-content`, {
        scale: scale,
    })

    const painel = document.querySelector(`.inventory-painel`)
    const colPainel = document.querySelector(`.collection-painel`)

    painel.style.width = `${inventoryC.getBoundingClientRect().width}px`
    painel.style.height = `${inventoryC.getBoundingClientRect().height}px`
    colPainel.style.width = `${collectionC.getBoundingClientRect().width}px`
    colPainel.style.height = `${collectionC.getBoundingClientRect().height}px`

    gsap.to(`:root`, {
        "--sat": `${appliedSat}%`
    })
}, 10)

function updateShop(){
    document.querySelector(`#havan`).innerHTML = Shop.values.reduce((acc, ele) => {
        acc += `<b>${ele.name} || BOOSTS:  L: ${ele.luckAttr} | F: ${ele.fortuneAttr} | S: ${ele.speedAttr}</b><br>`
        ele.requirements.forEach((el) => {
            acc += `<br><div class="shop-ele"><div>${(el[0].isMutation ? el[0].mutation : el[0].name).toUpperCase()} ${el[2]}/${el[1]}: </div><button class="deposit-btn" onclick="Shop.deposit('${ele.name}', '${el[0].name}')">Depositar</button></div>`
        })
        acc += `<br> <button onclick="afford('${ele.name}', ${ele.price})" class="buy-btn ${(ele.affordable && ele.price <= Pessoa.money) || ele.afforded ? `enabled`: ``}">BUY ${ele.price}R$</button> <button onclick="enable('${ele.name}')" class="buy-btn ${ele.afforded ? `enabled`: ``}">${ele.enabled ? `ENABLED`: `DISABLED`}</button><br> <hr>`
        return acc
    }, "")
}
function biomeLoop(){
    setTimeout(() => {
        time = 100
        let selectedBiomes = Object.entries(biomes).reduce((acc, [key, val]) => {
            acc.push([key, Math.random() < 1 / Number(val.split('-')[1])])
            return acc
        }, []).filter((ele) => ele[1])
        if(selectedBiomes.length !== 0){
            biome = Number(selectedBiomes[selectedBiomes.length-1][0])
            time = biomes[biome].split('-')[0] * 1000
            centerUpdate()
        }
        biomeLoop()
    }, time)
}
function afford(shop, price){
    shop = Shop.values[Shop.values.findIndex((ele) => ele.name === shop)]
    if(shop.affordable){
        if(shop.afforded) return
        if(Pessoa.money >= price){
            Pessoa.money -= price
            shop.afforded = true;
            centerUpdate()
            updateShop()
        }
    }
}
function enable(shop){
    shop = Shop.values[Shop.values.findIndex((ele) => ele.name === shop)]
    if(shop.afforded){
        if(shop.enabled){
            shop.enabled = false;
            shopEquipped = undefined;
            centerUpdate()
            updateShop()
            return
        }
        shop.enabled = true;
        shopEquipped = shop.acronym
        centerUpdate()
        Shop.values.forEach((ele) => {
            if(ele.name !== shop.name){
                ele.enabled = false;
            }
        })
        updateShop()
    }
}
// url                      ( >:3 )
// collection               ( >:3 )
// inventory                ( >:3 )
// FLIP bug                 ( >:3 )
// fix family-group         ( >:3 )
// disappearing info        ( >:3 )
// fix page to scroll       ( >:3 )
// inventory content update ( >:3 )

// fonts                    ( >:3 )
// audio                    ( >:3 )
// blocked-level            ( >:3 )
// biome                    ( >:3 )
// exclusive type           ()
// painel                   ()
// boost-inv                ()
// vizualizer               ()  
// shop                     ( >:3 )
// transition               ()
// equip                    ( >:3 )
   // aura-boosts           ( >:3 )
   // aura-base-colors      ( >:3 )
   // fortune               ( >:3 )
// robson things            ( >:3 )

//////////////////////////  

// col + inv painels bug    ( >:3 )
// equip + sell bug         ( >:3 )
// Collection bug           ( >:3 )
// SELL                     ( >:3 )
// RARE BREAKTHROUGH        ( >:3 )