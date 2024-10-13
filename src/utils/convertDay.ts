export default function convertToMySQLDate(isoDateString: string) {
    const date = new Date(isoDateString);
    
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Format in MySQL 'YYYY-MM-DD HH:MM:SS'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
