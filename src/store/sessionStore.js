import { defineStore } from 'pinia'


export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            sessionList: [],
            isDrawerOpened: false,
            selectedSession: {
                id: "",
                type: "",
                name: ""
            },
            backgrounRefresh: false
        }
    },
    actions: {
        changeOpenDrawer(status) {
            if (status !== undefined) {
                this.isDrawerOpened = status
                return
            }
            if (this.isDrawerOpened) {
                this.isDrawerOpened = false
            } else {
                this.isDrawerOpened = true
            }
        },
        addClient(id, name, host, t,) {
            let index = this.sessionList.findIndex((client) => client.id === id && client.type === t)
            let sd = {
                id: id,
                cli_id: host,
                type: t,
                name: name
            }
            if (index === -1) {
                this.sessionList.push(sd)
            }
            if (this.selectedSession != id) {
                this.setActiveSession(sd)
            }
            if (!this.isDrawerOpened) {
                this.isDrawerOpened = true
            }
        },
        removeClient(id, t) {
            let index = this.sessionList.findIndex((client) => client.id === id && client.type === t)

            if (index !== -1) {
                if (this.sessionList.length == 1) {
                    this.isDrawerOpened = false
                    this.selectedSession = {
                        id: "",
                        type: ""
                    }

                } else {
                    if (this.selectedSession.id === id && this.selectedSession.type === t) {
                        let n_id = index == 0 ? 1 : index - 1
                        this.setActiveSession(this.sessionList[n_id])
                    }
                }
                this.sessionList.splice(index, 1)
            }
        },
        hasSession(id, t) {
            let index = this.sessionList.findIndex((client) => client.id === id && client.type === t)
            if (index === -1) {
                return false
            } else {
                return true
            }
        },
        isSelectedSession(item) {
            if (this.selectedSession.id === item.id && this.selectedSession.type === item.type) {
                return true
            } else {
                return false
            }
        },
        setActiveSession(item) {
            this.selectedSession = {
                id: item.id,
                type: item.type,
                name: item.name
            }
        }
    }
})