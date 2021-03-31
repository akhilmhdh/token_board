<script>
    import store from "../store/socket.js";
    import DataTable from "smelte/src/components/DataTable";

    let messages = [];
    let data = new Array(10).fill(0).map((i, index) => ({ counter: index, token: 0 }));
    import { onMount } from "svelte";

    onMount(() => {
        store.subscribe((currentMessage) => {
            messages = [...messages, currentMessage];
        });
    });

    function onSendMessage(message) {
        if (message.length > 0) {
            store.sendMessage(message);
        }
    }

    const handleRowUpdate = ({ detail }) => {
        const { column, item, value } = detail;
        const index = data.findIndex((i) => i.counter === item.counter);
        data[index][column.field] = value;
        const payload = data.reduce((prevVal, currentValue, index) => {
            const formattedCommand = `P${currentValue.counter}:C${currentValue.token}`;
            return index === 0 ? formattedCommand : prevVal + "  " + formattedCommand;
        }, " ");
        onSendMessage(`u-${payload}`);
    };
</script>

<section>
    <div class="overflow-auto p-4 flex flex-col justify-center items-center">
        <div>
            <h5 class="h5">Booth Manager</h5>
        </div>
        <div class="w-60">
            <DataTable
                {data}
                class="w-full"
                on:update={handleRowUpdate}
                columns={[
                    { label: "Counter", field: "counter", editable: false, class: "md:w-10" },
                    {
                        label: "Token",
                        field: "token",
                        class: "md:w-10",
                    },
                ]}
                sortable={false}
                pagination={false}
            />
        </div>
    </div>
</section>
