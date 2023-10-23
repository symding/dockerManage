export const TaskStatus = {
    running: "success",
    shutdown: "danger",
    failed: "danger",
    orphaned: "danger",
    shutdown: "danger",
    complete: "primary",
}

export const ContainerState = {
    running: "success",
    exited: "danger",
    pending: "primary",
    waiting: "primary",
    success: "success",
    complete: "primary",
}

export const FormatTimestamp = (second) => {
    let day = Math.floor(second / 86400)
    let day_str
    if (day > 0) {
        day_str = `${day} day `
    } else {
        day_str = ""
    }
    second = second % 86400
    let hour = Math.floor(second / 3600)
    let hour_str
    if (hour > 0) {
        hour_str = `${hour} hour `
    } else {
        hour_str = ""
    }
    second = second % 3600
    let minute = Math.floor(second / 60)
    let minute_str
    if (minute > 0) {
        minute_str = `${minute} minute `
    } else {
        minute_str = ""
    }
    if (minute_str + hour_str + day_str == "") {
        return "0 minute ago"
    } else {
        return `${day_str}${hour_str}${minute_str}ago`
    }
}
