import moment from "moment";
import { BookingType } from "../pages/types/booking.type";
import api from "./api";

let bookingCache = {} as any;

export async function getBooking(idUser: number, forceUpdate?: boolean): Promise<BookingType> {
  if (!forceUpdate && idUser && bookingCache[idUser]) {
    return bookingCache[idUser];
  }
  if (!idUser) {
    return null as unknown as BookingType;
  }
  const { data } = await api.get(`/booking/user/${idUser}`);
  data.idBookingStr = data.idBooking.toLocaleString();
  data.dateCheckInStr = moment(data.dateCheckIn).format("DD/MM/YYYY");
  data.dateCheckOutStr = moment(data.dateCheckOut).format("DD/MM/YYYY");

  bookingCache[idUser] = data;
  return data;
}