import { CelestialBody } from "../types/celestial-body";

type Location = {
  longitude: number;
  latitude: number;
  elevation: number;
};

type APIResponse = {
  data: {
    dates: {
      from: string;
      to: string;
    };
    observer: Location;
    table: {
      header: string;
      rows: TableRow[];
    };
  };
};

type TableRow = {
  cells: {
    date: string;
    distance: string;
    extraInfo: string;
    id: string;
    name: string;
    position: {
      constellation: string;
      equatorial: string;
      horizonal: string;
      horizontal: {
        altitude: {
          degrees: number;
          string: string;
        };
        azimuth: {
          degrees: number;
          string: string;
        };
      };
    };
  }[];
  entry: {
    id: string;
    name: string;
  };
};
const defaultLocation = {
  longitude: -96.69649194582368,
  latitude: 40.82121710878628,
  elevation: 1200,
};

function buildAstronomyAPIUrl(
  location: Location,
  fromDate: string = getCurrentDate(),
  toDate: string = getCurrentDate(),
  time: string = getCurrentTime()
) {
  const baseUrl = "https://api.astronomyapi.com/api/v2/bodies/positions";
  const params = new URLSearchParams({
    longitude: location.longitude.toString(),
    latitude: location.latitude.toString(),
    elevation: location.elevation.toString(),
    from_date: fromDate,
    to_date: toDate,
    time: time,
  });
  return `${baseUrl}?${params.toString()}`;
}

function getCurrentTime(): string {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const currentTime = `${hours}:${minutes}:${seconds}`;
  return currentTime; // Extracts HH:MM:SS in local time
}

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // Extracts YYYY-MM-DD from ISO format
}

const responseToCelestialBodyList = (response: APIResponse) => {
  const celestialBodies: CelestialBody[] = [];

  response.data.table.rows.forEach((row) => {
    row.cells.forEach((cell) => {
      const position = cell.position.horizontal;
      const celestialBody: CelestialBody = {
        name: cell.name,
        azimuth: position.azimuth.degrees,
        polarAngle: position.altitude.degrees,
      };

      celestialBodies.push(celestialBody);
    });
  });

  return celestialBodies;
};

export const getAllGeoSpacialData: (
  location?: Location
) => Promise<CelestialBody[]> = async (location = defaultLocation) => {
  const url = buildAstronomyAPIUrl(location);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization:
          "Basic NTZmOTU1OWQtZGMzMi00ZDE3LTkxNmYtYWZhYWU0NjdmYmQ1OmFhOWY0ODU2MWMzZTU3YWE0NWViY2Y4Y2I3ZDViNWZiNGViMTljYzk4OTNjZWE1MmI4NDEzZGExYzAyYzE5NGE5ODU5MWRkZjg5MWQ1YjVlYThiZWM2ZThjNTE1MTg3MDI0MzVjNTQwODA0MzdlMTUwYjk0YTZkZDdiMDFlNzljMzVhMzEwNzc2YjEyYTcwNWI2ZGIxZmJhOThjYTZhMTk0NzlkOWVhZGNlYmYzNjI5N2I1OTNlMmY0NDQ5MzFkMmEzNGY2YjRkMzA0MWUzNGViZDUzYjk0NTVkM2ZkMGI3",
      },
    });

    const data: APIResponse = await response.json();
    return responseToCelestialBodyList(data);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
