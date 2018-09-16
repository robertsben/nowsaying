const MIN_LINE_LENGTH = 1
const MAX_LINE_LENGTH = 4

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const stringToLineByLine = (lyrics) => lyrics.split("\n")
const lineByLineToString = (byLine) => byLine.join("\n")

const chooseRandomSnippet = (lyrics) => {
  const lineByLine = stringToLineByLine(lyrics)
  const numberOfLines = getRandomInt(MIN_LINE_LENGTH, MAX_LINE_LENGTH)
  const startingLineNumber = getRandomInt(0, lineByLine.length - numberOfLines)
  return lineByLineToString(lineByLine.slice(startingLineNumber, startingLineNumber+numberOfLines))
}

const cleanLyrics = (lyrics) => {
  const lineByLine = stringToLineByLine(lyrics)
  // take out any whitespace
  const noWhitespace = lineByLine.filter((line) => /\S/.test(line))
  // take out any headers for Chorus, Vers 1 etc.
  const noHeaders = noWhitespace.filter((line) => !/\s*(\[.*\])\s*/.test(line))
  return lineByLineToString(noHeaders)
}

module.exports = {
  chooseRandomSnippet: chooseRandomSnippet,
  cleanLyrics: cleanLyrics
}