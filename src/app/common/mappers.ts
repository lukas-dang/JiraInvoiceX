export function mapProjectNameToInvoiceCode (name: string) {
  switch (name) {
    case 'CIA':
      return 'CIA - P_ECO_22_12'
    case 'NVAR':
      return 'NVAR - P_ECO_22_19'
    case 'NHVS':
      return 'NHVS - P_ECO_22_22'
    case 'SKLEP':
      return 'SKLEP - P_ECO_22_23'
    case 'TVPROG':
      return 'SKLEP - P_ECO_22_23'
    default:
      throw new Error(`Unknown project name: ${name}`)
  }
}
