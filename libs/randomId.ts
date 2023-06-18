export function randomId(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, "0");
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}_${random}`;
}