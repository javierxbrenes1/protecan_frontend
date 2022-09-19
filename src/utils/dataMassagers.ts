import { GetCdrsResponse, GetClientsType } from "../graphqlTypes/responses";
import { DateType, Time } from "../components/Inputs";
import { CdrEntry } from "../types";
import { CdrCollection } from "../graphqlTypes";

const months: Record<number, string> = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Setiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
}

export const parseClientsForSelection = (data: GetClientsType): { value: string, label: string }[] => {
    const {
        usersPermissionsUser: {
            data: {
                id,
                attributes: {
                    clients
                }
            }
        }
    } = data;
    const clientsList = clients.data.map((client: any) => {
        const { name } = client.attributes;
        return { value: client.id, label: name }
    });

    return clientsList;
}

export const formatTime = (time: Time, onlyHM = false): string => {
    const { hours, minutes } = time;
    if (hours == null && minutes == null) return '';
    return `${hours?.toString().padStart(2, '0')}:${minutes?.toString().padStart(2, '0')}${!onlyHM ? ':00:000' : ''}`;
}

export const parseDateElementsToNumber = (date: DateType) => {
    const { day, month, year } = date;
    if (!day && !month && !year) return {};
    return {
        day: Number(day),
        month: Number(month),
        year: Number(year)
    }
}

export const createDateAndTime = (time: Time, date?: Date) => {
    if (!date || (time.hours == null && time.minutes == null)) return null;
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time.hours), Number(time.minutes));
    return newDate;
}

export const formatDate = (date?: Date): string => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}


export const getCdrRelatedId = (data: any, mutation: string): string => {
    return data[mutation].data.id;
}

export const parseCdrCollectionToCdrEntry = (value: CdrCollection): CdrEntry => {
    const {
        status,
        clientCdrNumber,
        createDate,
        client,
        entrance,
        revision,
        report
    } = value.attributes;

    return {
        id: value.id,
        composedId: `${value.id}-${clientCdrNumber}`,
        status,
        createDate,
        clientCdrNumber,
        client: {
            id: client.data.id,
            name: client.data.attributes.name,
            active: client.data.attributes.active
        },
        entrance,
        revision,
        report: report?.data ? {
            name: report.data.attributes.name,
            url: report.data.attributes.url
        } : null
    }
}

export const parseCdrs = (response: GetCdrsResponse) => {
    const { data, meta } = response.cdrs;
    const parsedData: CdrEntry[] = data.map((value) => parseCdrCollectionToCdrEntry(value));
    return {
        parsedData,
        pagination: meta.pagination
    }
}

export const buildWordDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = String((date.getHours() % 12) || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} de ${months[month]} del ${year} a las ${hours}:${minutes} ${date.getHours() > 12 ? 'PM' : 'AM'}`;
}

export const parseStringTimeToTime = (stringTime?: string | null): Time => {
    if (!stringTime) {
        return {
            hours: undefined,
            minutes: undefined
        }
    }

    const [hours, minutes] = stringTime.split(':');
    return {
        hours: Number(hours),
        minutes: Number(minutes)
    }
}