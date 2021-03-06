let fs = require ('fs')
let path = require('path')
let os = require('os')
let { performance } = require('perf_hooks')
let handler  = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))
    let neww = performance.now()
    let exp = global.DATABASE.data.users[m.sender].exp
    let limit = global.DATABASE.data.users[m.sender].limit
    let name = conn.getName(m.sender)
    let d = new Date
    let locale = 'es'
    let weton = ['Domingo', 'Lunes', 'Martes', 'Miรฉrcoles', 'Jueves','Viernes','Sรกbado'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.DATABASE._data.users).length
    let tags = {
      'main': '๐ ๐๐ก๐จ',
      'xp': '๐๐๐ฝ & ๐๐ถ๐บ๐ถ๐',
      'sticker': '๐ฆ๐๐ถ๐ฐ๐ธ๐ฒ๐ฟ',
      'kerang': '๐๐๐ฒ๐ด๐ผ๐',
      'game': 'GAME',
      'images' : 'IMAGES',
      'data' : 'INFORMATION',
      'admin': '๐๐ฑ๐บ๐ถ๐ป',
      'group': '๐๐ฟ๐ผ๐๐ฝ',
      'internet': '๐๐ป๐๐ฒ๐ฟ๐ป๐ฒ๐',
      'downloader': '๐๐ผ๐๐ป๐น๐ผ๐ฎ๐ฑ๐ฒ๐ฟ',
      'tools': '๐ง๐ผ๐ผ๐น๐',
      'fun': '๐๐๐ป ๐บ๐ฒ๐ป๐',
      'jadibot': '๐๐ฎ๐ฑ๐ถ ๐๐ผ๐',
      'owner': '๐ข๐๐ป๐ฒ๐ฟ ๐บ๐ฒ๐ป๐',
      'host': '๐๐ผ๐๐',
      'advanced': '๐๐ฑ๐๐ฎ๐ป๐ฐ๐ฒ๐ฑ',
      'info': '๐๐ป๐ณ๐ผ',
      '': 'No Category',
    }
    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in  tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    function monospace(string) {
    let _3 = '`'.repeat(3)
    return _3 + string + _3
}
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || `
*โญโโใ ${conn.getName(conn.user.jid)} ใโโฎ*
*โโ:* ๐๐๐ถ, %name!
*โโ:* โ โย ย โเณเนโโโโเนเณโ* โ โย *ย ย ย ย ย ย 
*โโ:โโโขโเฏอเงกเงขอกอโฆโโโโโเฏอเงกเงขอกอโฆโโงโโบ*
*โโ:* โจ *%exp XP*
*โโ:* โ ๐๐ถ๐บ๐ถ๐๐ฒ๐ *%limit Limit*
*โโ:*
*โโ:* ๐๐๐ฒ๐ฐ๐ต๐ฎ: *%weton, %date*
*โโ:* โ๐๐ผ๐ฟ๐ฎ: *%time*
*โโ:*
*โโ:* ๐๐๐ถ๐ฒ๐บ๐ฝ๐ผ ๐ฑ๐ฒ ๐ฎ๐ฐ๐๐ถ๐๐ถ๐ฑ๐ฎ๐ฑ: *%uptime*
*โโ:* ๐ป๐ฎ๐ฐ๐๐ถ๐๐ถ๐ฑ๐ฎ๐ฑ ๐ฝ๐ฟ๐ถ๐ป๐ฐ๐ถ๐ฝ๐ฎ๐น *%muptime*
*โโ:* ๐๐๐ฎ๐๐ฎ๐ฏ๐ฎ๐๐ฒ: %totalreg numeros
*โโ:* โฆ ๐Navegador : *${conn.browserDescription[1]}*
*โโ:* โฆ ๐กservidor : *${conn.browserDescription[0]}*
*โโ:* โฆ โversion : *${conn.browserDescription[2]}*
*โโ:* โฆ ๐Velocidad : *${neww}* ms
*โโ:* โฆ ๐ฒSistema operativo : *${conn.user.phone.device_manufacturer}*
*โโ:* โฆ ๐ชversion de *WhatsApp* : ${conn.user.phone.wa_version}
*โโ:* ๐๐๐ฒ ๐๐๐ง๐๐ฅ ๐๐ ๐ฒ๐จ๐ฎ๐ญ๐ฎ๐๐
*โโ:* https://www.youtube.com/watch?v=chMc57gjmkI
*โโ:* ๐โ๐๐๐๐  ๐ก๐ 
*โโ:* @Samu330
*โโ:* โคSam y Perry๐
*โฐโโเงกเงขอกอโฆโโโโก๐ฆ๐ฎ๐บ๐๐ฏ๐ฏ๐ฌโโโโโเงกเงขอกอโฆโโฏ*
%readmore
*โญโโใ๐ ๐ข๐ฏ๐ฒ๐ฑ๐ฒ๐ฐ๐ฒ ๐น๐ฎ๐ ๐ฟ๐ฒ๐ด๐น๐ฎ๐ ๐ใ*
*โโโ*โ๐ท๐๐๐๐๐๐๐๐ ๐๐๐๐๐๐ ๐๐ ๐๐๐๐ฒ
*โโโ*โ๐ท๐๐๐๐๐๐๐๐ ๐๐๐๐ ๐๐ ๐๐๐โข
*โโโ*โ๐ต๐ ๐๐๐๐๐๐๐ ๐๐ ๐๐๐ ๐ ๐๐๐๐๐๐โป
*โโโ*โ๐บ๐๐๐๐๐ฬ๐๐๐๐ ๐ ๐๐ ๐๐๐๐๐๐
%readmore`
    let header = conn.menu.header || '*โญโโใโจ %category ใโโฎ*'
    let body   = conn.menu.body   || '*โโโ* %cmd%islimit'
    let footer = conn.menu.footer || '*โฐโโเงกเงขอกอโฆโโโโก๐ฅโโโโโเงกเงขอกอโฆโโฏ*\n'
    let after  = conn.menu.after  || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + `\n*%npmname@^%version*\n\`\`\`\%npmdesc\`\`\``
    let _text  = before + '\n'
    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? ' (Limit)' : '')  + '\n'
      }
      _text += footer + '\n'
    }
    _text += after
    text =  typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      exp, limit, name, weton, week, date, time, totalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).join`|`})`, 'g'), (_, name) => replace[name])
    conn.sendFile(m.chat, 'media/descarga (2).png', '', text.trim(), m)
  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menรบ tiene un error', m)
    throw e
  }
}
handler.help = ['menu','help','?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
