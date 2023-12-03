export function fineAddress(addr) {
    return addr.substring(0, 5) + '...' + addr.substring(addr.length - 5, addr.length)
}