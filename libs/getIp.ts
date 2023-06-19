import axios from "axios";
export default async function getIp() {
  const myIp = await axios.get('https://blog.gloomy-store.com/php/getIp.php');
  return myIp
}