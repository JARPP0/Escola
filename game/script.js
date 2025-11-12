class Shop {
    static values = [];

    constructor(nome, attributes, requirements, price, audio){
        Shop.values.push(this)
        this.name = nome
        this.attributes = attributes
        requirements = Object.entries(requirements).reduce((acc, [key, val]) => {
            acc.push([Pessoa.values[Pessoa.values.findIndex((ele) => ele.name === key)], val])
            return acc
        }, [])
        this.requirements = requirements
        this.price = price
        this.luckAttr = attributes[0]
        this.speedAttr = attributes[1]
        this.fortumeAttr = attributes[2]
        this.afforded = false;
        this.enabled = false;
    }
    static deposit(shop, name, type){
        let oldName = name
        shop = Shop.values[Shop.values.findIndex((ele) => ele.name = shop)]
        let oldShop = shop
        shop = shop.requirements[shop.requirements.findIndex((ele) => ele[0].fullName === name)]
        let oldShop2 = shop
        if(shop !== undefined){
            shop = shop[1]
            name = Pessoa.inventory[Pessoa.inventory.findIndex((ele) => ele[0].fullName === name)]
            if(name !== undefined){
                name = name[1]
                let baseValue = Math.min(name, type)
                if(baseValue >= shop){
                    name -= shop
                    shop = 0
                }
                else{
                    name = 0
                    shop -= baseValue
                }
                Pessoa.inventory = Pessoa.inventory.map((ele) => {
                    if(ele[0].fullName === oldName){
                        return [ele[0], name]
                    }
                    else return ele
                })
                oldShop.requirements = oldShop.requirements.map((ele) => {
                    if(ele[0].fullName === oldShop2[0].fullName){
                        return [ele[0], shop]
                    }
                    else return ele
                })
                updateInventory()
            }
            else console.warn(`item não achado no inventário`)
        }
        else console.warn(`item não achado no shop`)
    }
    get affordable(){
        let restingList = this.requirements.filter((ele) => {
            return ele[1] !== 0
        })
        return restingList.length === 0
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
    static families = new Map;

    static money = 0;

    static audio = {};
    constructor(nome, numbers, description, mutation, audio){
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

        this.isBreakthrough = typeof numbers !== `number` ? true : false;
        if(this.isBreakthrough){Pessoa.breakthrough.push(this)}
        if(this.isBreakthrough && numbers[2] === 1){Pessoa.special.push(this); this.isSpecial = true;}
        else{this.isSpecial = false;}

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
        Pessoa.collected = Pessoa.values[Pessoa.values.findIndex((ele) => {return ele.fullName === name.fullName})].acronym
        if(type === 0){
            if(!Pessoa.collection.some(ele => JSON.stringify(ele[0]) === JSON.stringify(name))){
                if(name.isBreakthrough && !name.isSpecial){
                    if(breakthrough){
                        name.collectSet.max = true;
                    }
                }
                if(!breakthrough){
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
            if(!fake){
                Pessoa.collect(minimum[1], minimum[0], 0)
                Pessoa.collect(minimum[1], minimum[0], 1)
            }
            return [minimum[1], minimum[0]]
        }
        else{
            list.sort((a, b) => a[2] - b[2])
            list = list[list.length - 1]
            if(!fake){
                Pessoa.collect(list[1], list[0], 0)
                Pessoa.collect(list[1], list[0], 1)
            }
            return [list[1], list[0]]
        }
    }
    static comum(luck, biome){
        let listCopy = eval(`Pessoa.biome${biome}`)
        listCopy = listCopy.filter((ele) => {return ele[0] > luck})
        listCopy = listCopy[0]
        return [listCopy, Pessoa.values[Pessoa.values.findIndex((ele) => ele.fullName === listCopy[1])]]
    }
}
/* iNSTÂNCIAS */
{
// Nome, [biome, neither, rarest], descrição, mutação;
// [Sala(0), Pátio(1), Refeitório(2), Quadra(3), Jardim(4), Coworking(5), PjMacumba(6), XiqueXiqueBahia(7), Inepresente(8), cosmos(9)
let Rodobelo = new Pessoa(`Rodobelo`, [1, 2, 30], `Gato mascote da escola`)
    let Rodobelo1 = new Pessoa(`Rodobelo`, [4, 2468, 24680], `Dono de uma tribo indígena`, `(Líder Catciquista)`)
    let Rodobelo2 = new Pessoa(`Rodobelo`, [9, 144012000, 1], `A ..Mística--- .-.Haverá-.- ...Veles--`, `M.E. potency O.W.`, ["The Cat Evolved Into The Microwave-Proof Cat! - Camellia", "/CONTENT/FS-12/Audios/TheCatEvolvedIntoTheMicrowave-proofCat!.mp3"]) // 9 / bioma 9 / 9 planetas /- imperador do sistema solar, busca deuses nos planetas(relação de deuses e planetas) // 144.012.000 - 12 signos / 144 = 12**2 = 100 + 44 = /Julio César(100a.C. - 44a.C.) // A Mística(rodobelo) Haverá(caçar) Veles(deus dos peixes[signo / comida de gato(rodobelo)]) A M H V - deslocamento 12(signo) cifra de césar(júlio césar / líder, similar á gata) = Myth(deuses / mythologic) // MEOW potency / Monarcy Extradimensional Omnipotent Whiskers(bigode de gato) / ..--- .-.-.- ...- = 2.3 = :3(gato) // the cat evolved to a microwave-proof cat

let Marcella = new Pessoa(`Marcella`, 3, `Mina da sala que gosta de ler`)
    let Marcella1 = new Pessoa(`Marcella`, 130500, `Conhecimento somado de todos os conhecimentos`, `Babel`, ["Freedom Dive - xi", "/CONTENT/FS-12/Audios/FreedomDive.mp3"]) // freedom dive

let Bia = new Pessoa(`Bia`, 4, `'Sobrecarga de Mídias'`)
    let Bia1 = new Pessoa(`Bia`, 144, `A única que perdi, foi para doar dindin`, `Rica de truco`)

let Paulo = new Pessoa(`Paulo`, [2, 5, 70], `Metade humano, metade rato`)
    let Paulo1 = new Pessoa(`Paulo`, [7, 700, 7000], `Trabaia nas ruas, na vivência do salário mínimo`, `Gari`)
    let Paulo2 = new Pessoa(`Paulo`, [4, 2000, 1], `Um cristal que Paulo jones procurava`, `Chesse Gem`)
    let Paulo3 = new Pessoa(`Paulo`, 555000, `Mim deixo ver se eu entendi, sua cantoria atrai mulheres para seu exército? EXATAMENTE`, `Gostosão`, ["Já que me ensinou a beber - Os barões da pisadinha", "/CONTENT/FS-12/Audios/JáQueMeEnsinouABeber.mp3"]) // já que me ensinou a beber

let Arthur = new Pessoa(`Arthur`, 8, `Obsessão por Cartas`)
    let Arthur1 = new Pessoa(`Arthur`, 80, `I-Armadura, PROVIDENCIADO DE (garrafa de metal)`, `MetalBat-I`)
    let Arthur2 = new Pessoa(`Arthur`, 1480, `II-Armadura, PROVIDENCIADO DE (cheats maliciosos)`, `MB.Cheatin'Balatro-II`)
    let Arthur3 = new Pessoa(`Arthur`, [6, 32960, 494400], `III-Armadura, PROVIDENCIADO DE (mutação de maconheiro)`, `MBChB-III.deck`)

let Pedro = new Pessoa(`Pedro`, [5, 10, 150], `Pleno, Pequeno, Não ocupa terreno, e fala: posto e torto que dá desconforto`)
    let Pedro1 = new Pessoa(`Pedro`, [7, 1010, 1], `3 pelo preço de 2? 2 pela preço de 3 serve`, `EmpresárioCLT`)
    let Pedro2 = new Pessoa(`Pedro`, [8, 101010, 1], `'Me dá dinheiro'`, `onu.inss.₱€Đ₹Ø.brl.ibge`,  ["Inking Mistake - NyxTheShield", "/CONTENT/FS-12/Audios/InkingMistake.mp3"]) // inking mistake

let Sabrina = new Pessoa(`Sabrina`, 12, `puro pop`)
    let Sabrina1 = new Pessoa(`Sabrina`, [8, 150000, 600000], `O olho dela já inventou umas 30 cores`, `Fofíris`, ["magnolia x pimp named slickback [Gyspy Woman & Roblox wave sound effect remix] - Playboi Carti, LAKIM, Gyspy Woman, D4DJ", "/CONTENT/FS-12/Audios/MxPNSB[GW&RWSER].mp3"]) // magnolia x pimp named slickback (gyspy woman x roblox wave sound)

let ArthurCorreia = new Pessoa(`ArthurCorreia`, 15, `Rei do gel`)
    let ArthurCorreia1 = new Pessoa(`ArthurCorreia`, 2400, `ONE-PIErcing`, `Gomu Gomu No Mi`)
    let ArthurCorreia2 = new Pessoa(`ArthurCorreia`, 75000, `アーサール POKEMON MASTER コレイア`, `0⁰2² Shuckle ¹1³3`)

let Kauany = new Pessoa(`Kauany`, 20, `Pesadelo do alcides`)
    let Kauany1 = new Pessoa(`Kauany`, 260, `e #### no ## com #### ###### bem #######`, `funkin`)

let Marcos = new Pessoa(`Marcos`, [5, 30, 1500], `olha mãe, eu tou no jogo!`)

let Vinicius = new Pessoa(`Vinícius`, [2, 25, 125], `Gosta de Strôgonobòlónofóff`)
    let Vinicius1 = new Pessoa(`Vinícius`, [4, 386100, 1], `Consente-me avistá-la-lho, se m’o desejares expor-lha além deste cosmo, pois conferi-mo-la-iam, caso to-lo consintissem.`, `Gnose`, ["Censored!! - t+pazolite", "/CONTENT/FS-12/Audios/Censored.mp3"]) // censored!!

let Lucas = new Pessoa(`Lucas`, 45, `Assistindo rolar a bola, tomando coca-cola vindo da sacola`)
    let Lucas1 = new Pessoa(`Lucas`, [3, 3600, 10800], `LuCR7 atira no gol, do outro gol`, `CR7`)

let Nathan = new Pessoa(`Nathan`, 45, `Ouh, ALEXA, ouh, ouh, ALEXA!`)
    let Nathan1 = new Pessoa(`Nathan`, [3, 5400, 16200], `Jogador Profissa`, `Camisa10`)

let Pietro = new Pessoa(`Pietro`, 45, `prazer e conhecer, sou pietro, não calma lá: encantado de conocerte, soy Pietro.`)
    let Pietro1 = new Pessoa(`Pietro`, [6, 202500, 1], `poção: house + pop + dance + dubstep + funk`, `Synthesis`, ["Synthesis - tn.shi", "/CONTENT/FS-12/Audios/Synthesis.mp3"]) // synthesis tn-shi

let Wallison = new Pessoa(`Wallison`, [1, 50, 600], `MMA na escola`)

let Titíco = new Pessoa(`Titíco`, 50, `Risadinha, amigo do Walisson`)
    let Titíco1 = new Pessoa(`Titíco`, 500, `Risadinha marota, Risadinha falsa`, `Coringa`)
    let Titíco2 = new Pessoa(`Titíco`, 2500, `ei mn, ta pegando no olho a tinta`, `Fiona`)

let Alexandre = new Pessoa(`Alexandre`, [1, 55, 1], `Funkeiro redimido`)
    let Alexandre1 = new Pessoa(`Alexandre`, [3, 825, 16500], `Mandando, Devendo, Pão de queijo`, `LÍDER`)
    let Alexandre2 = new Pessoa(`Alexandre`, [8, 412500, 1237500], `uma sala de aula não basta, eu quero comandar a macedõniah`, `O GRANDE`, ["Blue Horizon Funk - NXGHT! & DJ ZAP", "/CONTENT/FS-12/Audios/BlueHorizonFunk.mp3"]) // horizon blue funk

let Hiarles = new Pessoa(`Hiarles`, [1, 55, 110], `Gordinho tm`)

let Carlos = new Pessoa(`Cabeça`, 60, `não é cabeça por acaso, muito esperto`)
    let Carlos1 = new Pessoa(`Cabeça`, 300000, `facção criminosa em busca da makita`, `Bonde do pneu`, ["Cheiro de somebody that I used to know - Leod", "/CONTENT/FS-12/Audios/CheiroDePneuQueimado.mp3"]) // Pneu queimado

let Miguel = new Pessoa(`Miguel`, 65, `ei moo, você fica quieto`)
    let Miguel1 = new Pessoa(`Miguel`, 455000, `exército super-militar nível maior que bope`, `Bonde da makita`, ["Os Caras tão na Maldade - Yami", "/CONTENT/FS-12/Audios/OsCarasTãoNaMaldade.mp3"]) // Os Caras Estão na Maldade

let Guilherme = new Pessoa(`Guilherme`, 69, `'Arco de vilão da torre de cartas destruída'`)
    let Guilherme1 = new Pessoa(`Guilherme`, 552, `Despertada a sua braveza, pronto para aniquilar`, `NegãoMan`)

let Davi = new Pessoa(`Davi`, 70, `cuidado que ele vem lutando caipoeira`)
    let Davi1 = new Pessoa(`Davi`, 700000, `seu poder de fogo supera todas as pontas de todas as tecnologias`, `*tech tech* technoloGuy`, ["Million PP - Camellia", "/CONTENT/FS-12/Audios/MillionPP.mp3"]) // million pp

let Bigode = new Pessoa(`Bigode`, [5, 75, 225], `'Reconheço esta curvatura desta pelagem facial de longe'`)

let Luís = new Pessoa(`Luís`, [1, 75, 375], `coitada da jhemile`)

let Matheus = new Pessoa(`Matheus`, 80, `Demolindo sorrindo`)
    let Matheus1 = new Pessoa(`Matheus`, 1280, `'É U É'`, `Boiadero`)

let Yuri = new Pessoa(`Yuri`, 90, `cuidado para não ser beijado`)
    let Yuri2 = new Pessoa(`Yuri`, 2700, `Tome cuidado, ele pode te infectar`, `Shrek`)
    let Yuri1 = new Pessoa(`Yuri`, [7, 41850, 308250], `FREEFIRE para a vida!`, `FreefiRe p/Vp`) //F R V - forever, p/V - para a vida

let Alison = new Pessoa(`Alison`, 100, `De fé, ele é`)
    let Alison1 = new Pessoa(`Alison`, [7, 8000, 24000], `ÍDOLOdoBOX`, `BoxGoat`)

let Alfredo = new Pessoa(`Alfredo`, 150, `Stickman da maria`)
    let Alfredo1 = new Pessoa(`Alfredo`, 1950000, `Este lápis não é para papéis, serve para realidades`, `Sketch`, ["Steel Terror - Acid-notation", "/CONTENT/FS-12/Audios/SteelTerror.mp3"]) // steel terror

let Yago = new Pessoa(`Yago`, [5, 191, 1], `vítima da sociedade`)
    let Yago1 = new Pessoa(`Yago`, [5, 13370, 1], `qual do mercado você quer? como fazer bomba atõmica, de hidrogênio, ou uma usina nuclear`, `404`)

let Malu = new Pessoa(`Malu`, 200, `MALU -> UMA L`)
    let Malu1 = new Pessoa(`Malu`, 200000, `o passado é meu, o presente é do passado`, `Cronista Arcaica`, ["Flash me back - Camellia", "/CONTENT/FS-12/Audios/FlashMeBack.mp3"]) // flash me back

let Raquel = new Pessoa(`Raquel`, 250, `Eu Tolero Minúsculo Em Outros Nomes, Mas Quando É No Meu, Eu Te Provo Quão Minúsculo É Você`)
    let Raquel1 = new Pessoa(`Raquel`, 100000, `"Deixe que eu levo seu português por você, não precisa de sua voz quando quiser gritar por resgate"`, `A Oradora silenciosa`, ["Blue Horizon Funk - NXGHT! & DJ ZAP", "/CONTENT/FS-12/Audios/AmigaDaMinhaMulher.mp3"]) // amiga da minha mulher

let Maria = new Pessoa(`Maria`, 400, `Ser de potência subestimada, mas gosta de um chocolate`)
    let Maria1 = new Pessoa(`Maria`, 7600, `CROOCS mortal, seu arremesso exala moral`, `CROOCS`)
    let Maria2 = new Pessoa(`Maria`, 1200000, `a loucura pode vir de não saber o que é o que foi`, `Mestra da Ilusão`, ["World's End BLACKBOX - DDDice", "/CONTENT/FS-12/Audios/World'sEndBlackbox.mp3"]) //world's end blackbox

let Thales = new Pessoa(`Thales`, 685, `Ainda bem que sabem que é mentira -2025`)
    let Thales1 = new Pessoa(`Thales`, 13700, `Beira Omniconciência`, `Mileto`)

let Maycon = new Pessoa(`Maycon`, 1111, `verbo to be bado`)
    let Maycon1 = new Pessoa(`Maycon`, 83325, `SMT PT — SoMeThing PaTient — tem que saber inglês`, `Poliglota Sombrio`)

let PedroGRANDE = new Pessoa(`PedroGRANDE`, 1275, `Ônibus é um lego`)
    let PedroGRANDE1 = new Pessoa(`PedroGRANDE`, [9, 1083700, 1], `"Fuma meteoro e sai nebulosas`, `Planet`, ["Galaxy Collapse - Kurokotei", "/CONTENT/FS-12/Audios/GalaxyCollapse.mp3"]) // galaxy collapse

let TARZAN = new Pessoa(`T A R Z A N`, [4, 1400, 7000], `'êêêêêêêêê!!'`)
    let TARZAN1 = new Pessoa(`T A R Z A N`, [4, 1125000, 5625000], `versão bostil da mãe natureza`, `Pai Amazônia`, ["Aegleseeker - Frums & Silentroom", "/CONTENT/FS-12/Audios/Aegleseeker.mp3"]) // aegleseeker

let Arlan = new Pessoa(`Arlan`, 1500, `hey guys, para isso aí`)
    let Arlan1 = new Pessoa(`Arlan`, 52500, `me zoaram o suficiente já...`, `MoniDOR`)

let Rafael = new Pessoa(`Rafael`, 1665, `Estou vendo gente morta!!`)
    let Rafael1 = new Pessoa(`Rafael`, [4, 66600, 999000], `'Meu segundO empRego, enTeudEu'`, `NECROMANTE`)

let Hebert = new Pessoa(`Hebert`, 2000, `ok, é A né? justifique então, faça isso para as outras 14`)
    let Hebert1 = new Pessoa(`Hebert`, 240000, `e essa placa tectõnica... um pouquinho para a esqueda. Perfeito!`, `Cartógrado do caos`, ["Final blenderman appeared - Camellia", "/CONTENT/FS-12/Audios/FinalBlendermanAppeared.mp3"]) //final blenderman appeared
    let Hebert2 = new Pessoa(`Hebert`, 40002000, `O deus HISTÓRICO que carrega toda a GEOGRAFIA do planeta Terra`, `Atlas`,  ["Lament Rain - DDDice & Ashrount", "/CONTENT/FS-12/Audios/LamentRain.mp3 "]) // lament rain

let Alcides = new Pessoa(`Alcides`, 3000, `sua praga é dilema, premissa e profecia`)
    let Alcides1 = new Pessoa(`Alcides`, 600000, `fabricando o canetão perfeito...`, `Alquimista Profano`, ["Dimnesion - Creo", "/CONTENT/FS-12/Audios/Dimension.mp3"]) //dimension

let Gigante = new Pessoa(`Gigante`, 4000, `o pequenot- gigante destruidor de cidades`)

let QueroQuero = new Pessoa(`Quero-Quero`, 5000, `poucos se atrevem mexer com ele`)
    let QueroQuero1 = new Pessoa(`Quero-Quero`, 5000000, ``, `Phoenigarasu`, ["INVERSION - tn.shi", "/CONTENT/FS-12/Audios/Inversion.mp3"])

let PomboGordo = new Pessoa(`PomboGordo`, [4, 27500, 687500], `é um pombo, é gordo, é um pombo gordo`)

let TrinitédesGnomes = new Pessoa(`Trinité des Gnomes`, [4, 60000, 1800000], `A GRANDIOSA nação`)

let Brotheragi = new Shop(`Brotheragi`, [1.5, 1.5, 1.5],
    {Paulo: 5, Arthur: 5, Pedro: 3, Marcos: 3,  Lucas: 5,
    Nathan: 5, Alison: 2, Yago: 1}
    , 150)
document.querySelector(`#audio-list`).innerHTML = Object.entries(Pessoa.audio).reduce((acc, [id, src]) => {
    acc.push(`<audio id="${id}" src="${src}" loop></audio>`)
    return acc
}, []).join("")
}
let blockList = []
let sellQuantity = 1;
let pulsePoint = 1;
let secPulsePoint = 1;

let displayedElement;
let inventoryDisplay = false;
let musicSvg = `<svg class="musicSvg" width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="main-color" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ed9393"/>
            <stop offset="100%" stop-color="#e2a57a"/>
        </linearGradient>
    </defs>
    
    <rect width="27" height="23" rx="5" fill="url(#main-color)"/>
    <path d="M13.9043 20.1982L5.02441 15.3408L5.03516 15.334C3.55116 14.5934 2.53125 13.0613 2.53125 11.29C2.5313 9.51862 3.55093 7.98563 5.03516 7.24512L5.02441 7.23926L13.9043 2.38184V20.1982Z" fill="#ffffff"/>
    <path d="M15.7744 2.41006C20.6851 2.38787 24.6934 6.34101 24.7344 11.2558C24.7753 16.182 20.8142 20.2089 15.8877 20.2499C15.8499 20.2502 15.8121 20.2481 15.7744 20.248V18.3817L15.7773 18.3827C19.6924 18.3827 22.8662 15.244 22.8662 11.372C22.8662 7.49995 19.6924 4.36124 15.7773 4.36124H15.7744V2.41006Z" fill="#ffffff"/>
    <path d="M15.7744 6.61719C18.5347 6.65834 20.7597 8.87295 20.7598 11.6006C20.7596 14.3282 18.5347 16.5419 15.7744 16.583V14.5586C17.4161 14.5182 18.7342 13.2098 18.7344 11.6006C18.7343 9.9913 17.4161 8.68301 15.7744 8.64258V6.61719Z" fill="#ffffff"/>
    </svg>`
let elementClick;
let AudioPlaying = '';
let picked;
let active = false;
icdEmptyUpdate()
console.log(Pessoa.values)
document.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`#roll`).addEventListener(`click`, () => {
        let jump = function(selector){
            gsap.timeline().set(selector, {
                y: 0
            }).to(selector, {
                y: -6,
                ease: `power2.out`,
                duration: 0.2
            }).to(selector, {
                y: 0,
                ease: `power2.in`,
                duration: 0.3
            })
        }
        active = true;
        for(let i = 0; i < 11; i++){
            setTimeout(() => {
                picked = Pessoa.roll(100000000, 1, true);
                jump(`#center-name`)
                setTimeout(() => jump(`#center-rariety`), 40)
            }, 25*i**2 + 25*i - 50)
        }
        
        setTimeout(() => {
            active = false;
            updateInventory(true)
            jump(`#center-name`)
            setTimeout(() => jump(`#center-rariety`), 40)
        }, 3850)
    })
})
document.querySelector(`#inv-dropdown`).addEventListener(`click`, () => {
    if(!inventoryDisplay){
        gsap.to(document.querySelector(`#inventory-content`), {
            x: -500,
            duration: 0.2,
            onComplete: () => {
                inventoryDisplay = true;
            }

        })
        return false
    }
     gsap.to(document.querySelector(`#inventory-content`), {
        x: 0,
        duration: 0.2,
        ease: `power2.out`
    })
    inventoryDisplay = false;
})
document.addEventListener(`mousemove`, (e) => {
    elementClick = document.elementFromPoint(e.clientX, e.clientY)
})
function pieceUpdateInventory(){
    let blockList = Pessoa.inventory.reduce((acc, [name, quantity]) => {
        acc.push(
            `<span onclick="display('${name.acronym}')" class="inv-ele" data-id="inv-${name.acronym}">
                <pre>
<span class="preElement" style="font-size: 13px;">${name.name}</span>
${name.isMutation ? `<span class="preElement" style="font-size: 12px; display: inline-block; transform: translateY(-3px);">(${name.mutation})</span><br>`: ""}1 in ${name.least}
                
                </pre>
                ${name.least >= 100000 ? `<span class="musicSpan"><span class="musicSpan-hitbox" onclick="audioPlay('${name.acronym}')"></span>${musicSvg}</span>`: ``}
                <span id="quantity">x${quantity}</span>
            </span>`)
        return acc
    }, [])
    return blockList
}
function updateInventory(main){
    console.log("inventory updated");
    console.log(Pessoa.collection)
    let elementList = Array.from(document.querySelector(`.inventory-block`).children)
    let rolled = Pessoa.roll(100000000, 9);
    let blockList = pieceUpdateInventory()
    let position = new Map
    elementList.forEach((ele) => {
        position.set(ele.dataset.id, ele.getBoundingClientRect())
    })
    document.querySelector(`.inventory-block`).innerHTML = blockList.join("")
    if(main){
        picked = [...rolled]
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
                    duration: 0.3
                })
            }
            else{
                gsap.set(ele, {scale: 0})
                gsap.to(ele, {scale: 1, duration: 0.2})
            }
            if(ele.dataset.id === `inv-${rolled[0].acronym}`){
                gsap.from(`[data-id="inv-${ele.dataset.id.split(`-`)[1]}"]`, {
                    backgroundColor: `rgb(237, 147, 147)`,
                    clearProps: `backgroundColor`
                })
                if(displayedElement === ele.dataset.id.split("-")[1]){
                    display(ele.dataset.id.split("-")[1])
                }
            }
        })
    })
}
function icdEmptyUpdate(){
    console.log("icd updated");
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
function display(id){
    console.log("display updated");
    if(elementClick.matches(`.musicSpan`) || elementClick.matches(`#quantity`) || elementClick.matches(`.musicSpan-hitbox`)){ return false;}
    const name = Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === id)]
    let quantity = Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === id)]
    if(!quantity){
        quantity = 0;
    }
    else{
        quantity = quantity[1];
    }
    console.log(secPulsePoint)
    console.log(elementClick)
    if(secPulsePoint === 2){ 
        if(!elementClick.matches(`.sell-methods`)){
            console.log(`aaaa`)
            Pessoa.inventory[Pessoa.inventory.findIndex(([obj]) => obj.acronym === name.acronym)][1] = Math.max(quantity - sellQuantity, 0)
            Pessoa.money += (quantity - Math.max(quantity - sellQuantity, 0)) * name.price
            document.querySelector(`#money`).textContent = Pessoa.money
            sellUpdateInventory(id)
            icdEmptyUpdate()
            return false;
        }
    }
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
            document.querySelector(`#money`).textContent = Pessoa.money
            display(id)
            sellUpdateInventory(id)
            icdEmptyUpdate()
        }
    }
    icdEmptyUpdate()

}
function sellUpdateInventory(id){
    if(id === AudioPlaying){
        audioPlay(id)
    }
    console.log("sell-inventory updated");
    let verification = (Pessoa.values[Pessoa.values.findIndex((ele) => ele.acronym === id)])
    verification = verification.quantity !== 0
    Pessoa.inventory = Pessoa.inventory.map(([o]) => [o, o.quantity])
    Pessoa.inventory = Pessoa.inventory.filter(([obj]) => obj.quantity !== 0)
    if(!verification){
        gsap.to(`[data-id="inv-${id}"]`, {
            opacity: 0,
            scale: 0,
            ease: `back.out(1.7)`,
        })
        setTimeout(() => {
            let position = new Map
            let blockList = pieceUpdateInventory()
            console.log(blockList)
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
        console.log(`#${ide}`)
        console.log(audioElement)
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
function hash(string, smooth){
    if(!active) return string;
    if(smooth){
        let alphabetList = 'ABCDEFGHIJKLMNOPabcdefghijklmnop'
        let random = Array.from(string).reduce((acc, ele) => {
            if(Math.random() < 0.1){
                acc += alphabetList.at(Math.floor(Math.random() * alphabetList.length))
            }
            else{
                acc += ele
            }
            return acc
        }, '')
        return random
    }
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
setInterval(() => {
    gsap.fromTo(`#sell-type-grid > :nth-child(${pulsePoint})`, {
        backgroundColor: `rgba(255, 245, 222, 1)`,
    }, {
        backgroundColor: `rgba(255, 125, 99, 0.418)`,
        duration: 1
    })
    gsap.fromTo(`#auto-type-grid > :nth-child(${secPulsePoint})`, {
        backgroundColor: `rgba(255, 245, 222, 1)`,
    }, {
        backgroundColor: `rgba(255, 125, 99, 0.418)`, 
        duration: 1
    })
}, 300)
setInterval(() => {
    let windowsH = window.innerHeight
    let windowsW = window.innerWidth
    let inventoryH = document.querySelector(`#inventory-content`).getBoundingClientRect().height
    let inventoryW = document.querySelector(`#inventory-content`).getBoundingClientRect().width

    let inventory = inventoryH / gsap.getProperty('#inventory-content', 'scale')
    scale = Math.min(((windowsH - 18.81) / (inventory)), (windowsW / inventoryW  / 2))
    gsap.to(document.querySelector(`#inventory-content`), {
        scale: scale,
    })
}, 10)
setInterval(() => {
    if(picked){
        document.querySelector(`#center-rariety`).innerHTML = `1 em ${hash(picked[0].least)}`
        if(!picked[0].mutation){document.querySelector(`#center-name`).innerHTML = hash(picked[0].name, true)}
        else document.querySelector(`#center-name`).innerHTML = hash(picked[0].mutation, true)
    }
}, 100)
// url                      ( >:3 )
// collection               ( >:3 )
// inventory                ( >:3 )
// FLIP bug                 ( >:3 )
// fix family-group         ( >:3 )
// disappearing info        ( >:3 )
// fix page to scroll       ( >:3 )
// inventory content update ( >:3 )
// equip                    ()
// audio                    ( >:3 )
// imagem                   ()
//////////////////////////  
// vizualizer               ()  
// search                   ()
// cadastro                 ()

// SELL                     ( >:3 )
// RARE BREAKTHROUGH        ( >:3 )