import { defineStore } from 'pinia'
import http from '../utils/http'
// import { useSessionStore } from './sessionStore'


class Container {
    constructor(
        host,
        id,
        name
    ) {
        this.host = host
        this.id = id
        this.name = name
    }
    Name() {
        return this.name.replace('/', '')
    }
    Operation(action) {
        switch (action) {
            default: this.Operation(action); break
        }
    }
    async Stat() {
        let response = await http.get('docker/container_stats', {
            method: 'get',
            params: {
                client_host: this.host,
                container_id: this.id
            },
        })
        return response.data
    }
    Operation(action) {
        http.get('docker/container_remove', {
            method: 'get',
            params: {
                client_host: this.host,
                container_id: this.id,
                action: action,
            },
        })
    }
    async Inspect() {
        let response = await http.get('docker/container_inspect', {
            method: 'get',
            params: {
                client_host: this.host,
                container_id: this.id,
            },
        })
        return response.data
    }
}


class Service {
    constructor(
        host,
        id,
        name
    ) {
        this.host = host
        this.id = id
        this.name = name
    }
    async tasks() {
        let response = await http.get('docker/service_tasks', {
            method: 'get',
            params: {
                client_host: this.host,
                service_id: this.id
            },
        })
        return response.data
    }
    async inspect() {
        let response = await http.get('docker/service_inspect', {
            method: 'get',
            params: {
                client_host: this.host,
                service_id: this.id
            },
        })
        return response.data
    }
}
export const useDockerClientStore = defineStore('dockerClient', {
    state: () => {
        return {
            clients: {
                "local": {
                    id: "local",
                    name: "local",
                    host: "",
                }
            },
            activeClientId: "local",
            navigation: [
                {
                    name: "docker",
                    items: [
                        {
                            text: "Service",
                            index: `/e/local/service`,
                            icon: 'icon-service',
                            page_type: "Service"
                        },
                        {
                            text: "Container",
                            index: `/e/local/container`,
                            icon: 'icon-container',
                            page_type: "Container"
                        }
                    ]
                }
            ]
        }
    },
    actions: {
        async scaleService(id, version, replicas) {
            let cli = this.clients[this.activeClientId]
            let response = await http.post('docker/scale_service',
                {
                    client_host: cli.host,
                    version: version,
                    replicas: replicas,
                    service_id: id
                }
            )
            return response.data
        },
        async removeServices(l) {
            let cli = this.clients[this.activeClientId]
            l.forEach(async item => {
                let response = await http.get('docker/remove_service', {
                    method: 'get',
                    params: {
                        client_host: cli.host,
                        service_id: item
                    },
                })
            })
        },
        async getClientList() {
            let response = await http.get('docker/client_list', {
                method: 'get'
            })
            let cli = [{
                name: "local",
                host: ""
            }]
            response.data.forEach(element => {
                element['id'] = element.name
                this.clients[element.name] = element
                cli.push(element)
            });
            console.log(this.clients)
            return cli
        },
        async addClient(name, host) {
            let response = await http.post('docker/add_client ',
                {
                    name: name,
                    host: host
                }
            )
            return response.data
        },
        activeClient() {
            console.log(this.activeClientId)
            return this.clients[this.activeClientId]
        },
        setActiveClient(id) {
            this.navigation = [
                {
                    name: "docker",
                    items: [
                        {
                            text: "Service",
                            index: `/e/${id}/service`,
                            icon: 'icon-service',
                            page_type: "Service"
                        },
                        {
                            text: "Container",
                            index: `/e/${id}/container`,
                            icon: 'icon-container',
                            page_type: "Container"
                        }
                    ]
                }
            ]
            this.activeClientId = id
        },
        async contianerList() {
            let id = this.activeClientId
            let response = await http.get('docker/container_list', {
                method: 'get',
                params: {
                    client_host: this.clients[id].host,
                },
            })
            return response.data
        },
        getContainer(container_id) {
            let cli = this.clients[this.activeClientId]
            var name
            if (cli.containers[container_id] === undefined) {
                name = null
            } else {
                name = cli.containers[container_id].name
            }
            return new Container(
                cli.host,
                container_id,
                name)
        },
        getService(service_id) {
            let cli = this.clients[this.activeClientId]
            var name
            if (cli.services[service_id] === undefined) {
                name = null
            } else {
                name = cli.services[service_id].Name
            }
            return new Service(
                cli.host,
                service_id,
                name)
        },
        getContainerByHost(client_id, container_id) {
            let cli, name
            name = null
            return new Container(
                cli.host,
                container_id,
                name)
        },
        async nodeList() {
            let id = this.activeClientId
            let response = await http.get('docker/node_list', {
                method: 'get',
                params: {
                    client_host: this.clients[id].host,
                },
            })
            return response.data
        },
        async serviceList() {
            let id = this.activeClientId
            console.log(id)
            let response = await http.get('docker/service_list', {
                method: 'get',
                params: {
                    client_host: this.clients[id].host,
                },
            })
            this.clients[id].services = {}
            return response.data
        },
        async fetchLog(c_id, id, type, tail) {
            let host = this.clients[c_id].host
            let response = await http.get("docker/container_log", {
                method: 'get',
                params: {
                    client_host: host,
                    id: id,
                    tail: tail,
                    type: type

                },
            })
            return response.data
        },
        async networkList() {
            let id = this.activeClientId
            let response = await http.get('docker/network_list', {
                method: 'get',
                params: {
                    client_host: this.clients[id].host,
                },
            })
            return response.data
        },
        async createService(serviceSpec) {
            let id = this.activeClientId
            let response = await http.post('docker/create_service ',
                {
                    client_host: this.clients[id].host,
                    spec: serviceSpec
                }
            )
            return response.data
        },
        async ClientInfo() {
            let cli = this.activeClient()
            let response = await http.get('docker/client_info', {
                method: 'get',
                params: {
                    client_host: cli.host,
                },
            })
            return response.data
        }
    }
}
)