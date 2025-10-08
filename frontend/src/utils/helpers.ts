export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateName(name: string) {
  const splitedName = name?.trim()?.split(" ");

  if (splitedName?.length > 1) {
    return splitedName?.[1];
  }

  return name;
}

export const formatCountdown = (secs: number) => {
  const minutes = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secs % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const formatNameToCapitalize = (name: string) => {
  const names = name?.trim().split(" ");

  if (names?.length > 1) {
    return names
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(" ");
  }

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
