import balloon from "../../assets/balloon.png";
import breakfast from "../../assets/breakfast.png";
import bus from "../../assets/bus.png";
import helicopter from "../../assets/helicopter.png";
import lunch from "../../assets/lunch.png";
import bike from "../../assets/bike.png";
import parks from "../../assets/parks.png";
import plane from "../../assets/plane.png";
import scooter from "../../assets/scooter.png";
import shopping from "../../assets/shopping.png";
import taxi from "../../assets/taxi.png";
import transport from "../../assets/transport.png";

export const itemList = [
    { id: 1, title: "park", icon: parks},
    { id: 2, title: "breakfast", icon: breakfast},
    { id: 3, title: "taxi", icon: taxi},
    { id: 4, title: "plane", icon: plane},
    { id: 5, title: "bike", icon: bike},
    { id: 6, title: "shopping", icon: shopping},
    { id: 7, title: "helicopter", icon: helicopter},
    { id: 8, title: "bus", icon: bus},
    { id: 9, title: "balloon", icon: balloon},
    { id: 10, title: "lunch", icon: lunch},
    { id: 11, title: "scooter", icon: scooter},
    { id: 12, title: "transport", icon: transport},
  ];

  const iconByTitleTemp = {} as any;
  itemList.forEach(item => iconByTitleTemp[item.title] = item.icon);

  console.log(iconByTitleTemp);
  
  export const iconByTitle = iconByTitleTemp;