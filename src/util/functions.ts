class Functions{
  numberToText(num: number):string{
    const special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
    const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
    if (num < 20) return special[num];
    if (num%10 === 0) return deca[Math.floor(num/10)-2] + 'ieth';
    return deca[Math.floor(num/10)-2] + 'y-' + special[num%10];
  }
}

export default new Functions();