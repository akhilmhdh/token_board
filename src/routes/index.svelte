<script>
    import store from "../store/socket.js";
    import DataTable from "smelte/src/components/DataTable";
    import Card from "smelte/src/components/Card";
    import Button from "smelte/src/components/Button";

    let rows = [];
    import { onMount } from "svelte";

    onMount(() => {
        store.subscribe((currentMessage) => {
            if (!currentMessage) return;
            const key = currentMessage.charAt(0);
            const payload = currentMessage.substr(2);
            switch (key) {
                case "p": {
                    const data = JSON.parse(payload);
                    rows = data;
                }
                    break;
                case "n": {
                    const data = JSON.parse(payload);
                    rows = [...rows, data];
                }
                    break;
                default:
                    break;
            }
        });
    });

    function onSendMessage(message) {
        if (message.length > 0) {
            store.sendMessage(message);
        }
    }

    const handleRowUpdate = ({ detail }) => {
        const { column, item, value } = detail;
        const index = data.findIndex((i) => i.id === item.id);
        rows[index][column.field] = value;
        // const payload = data.reduce((prevVal, currentValue, index) => {
        //     const formattedCommand = `P${currentValue.counter}:C${currentValue.token}`;
        //     return index === 0 ? formattedCommand : prevVal + "  " + formattedCommand;
        // }, " ");
        onSendMessage(`u-${item.counter}-${value}`);
    };

    const handleRowCreate = () => {
        store.sendMessage(`c`);
    };
</script>

<section>
    <div class="overflow-auto p-4 flex flex-col justify-center items-center">
        <div>
            <h5 class="h5">Booth Manager</h5>
        </div>
        <div class="w-60 flex">
            <div class="mr-4">
                <DataTable data={rows} class="w-full" on:update={handleRowUpdate} columns={[ { label: "Counter" ,
                    field: "counter" , editable: false, class: "md:w-10" }, { label: "Token" , field: "token" ,
                    class: "md:w-10" , }, {}, ]} sortable={false} pagination={false} />
            </div>
            <div>
                <Card.Card>
                    <div slot="title">
                        <Card.Title title="Menu" />
                    </div>
                    <div slot="actions">
                        <div class="p-2">
                            <Button text on:click={handleRowCreate}>Add Counter</Button>
                        </div>
                    </div>
                </Card.Card>
            </div>
        </div>
    </div>
</section>