import { axios } from "./Vaccine.api";
export class VaccineScheduleApi {
  static vaccineSchedules = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-schedule/all/find-all`,
      data: data,
    });
  };
}
