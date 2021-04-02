<script>
    import store from "../store/socket.js";
    import DataTable from "smelte/src/components/DataTable";
    import Card from "smelte/src/components/Card";
    import Button from "smelte/src/components/Button";

    let rows = [];

    $: highestToken = Math.max.apply(
        Math,
        rows.map((el) => parseInt(el.token))
    );

    import { onMount } from "svelte";

    onMount(() => {
        store.subscribe((currentMessage) => {
            if (!currentMessage) return;
            const key = currentMessage.charAt(0) === "t" ? "u" : currentMessage.charAt(0);
            const payload = currentMessage.substr(2);
            switch (key) {
                case "p":
                    {
                        const data = JSON.parse(payload);
                        rows = data;
                    }
                    break;
                case "n":
                    {
                        const data = JSON.parse(payload);
                        rows = [...rows, data];
                    }
                    break;
                case "u":
                    {
                        const [counter, token, id] = payload.trim().split("-");
                        const index = rows.findIndex((i) => i.id === parseInt(id));
                        rows[index].counter = counter;
                        rows[index].token = token;
                    }
                    break;
                default:
                    break;
            }
        });
    });

    const handleRowUpdate = ({ detail }) => {
        const { column, item, value } = detail;
        const index = rows.findIndex((i) => i.id === item.id);
        rows[index][column.field] = value;

        if (column.field === "counter" && !value) {
            store.sendMessage(`d-${item.id}`);
        } else if (column.field === "token") {
            store.sendMessage(`t-${rows[index].counter}-${rows[index].token}-${item.id}`);
        } else {
            store.sendMessage(`u-${rows[index].counter}-${rows[index].token}-${item.id}`);
        }
    };

    const handleRowCreate = () => {
        store.sendMessage(`c`);
    };

    const handleBoardClear = () => {
        store.sendMessage(`r`);
    };
</script>

<section>
    <div class="overflow-auto p-4 flex flex-col justify-center items-center">
        <div>
            <h5 class="h5">Booth Manager</h5>
        </div>
        <div class="w-full md:w-1/2 flex">
            <div class="mr-4 flex-grow">
                <DataTable
                    data={rows}
                    class="w-full"
                    on:update={handleRowUpdate}
                    columns={[
                        { label: "Counter", field: "counter", class: "md:w-10" },
                        {
                            label: "Token",
                            field: "token",
                            class: "md:w-10",
                            value: (v) =>
                                parseInt(v.token) === highestToken ? `${v.token} <-` : v.token,
                        },
                    ]}
                    sortable={false}
                    pagination={false}
                />
            </div>
            <div class="w-48">
                <Card.Card elevation={10} hoverElevation={10}>
                    <div slot="title">
                        <Card.Title title="Menu" subheader="Highest Token" />
                    </div>
                    <div slot="text" class="p-5 pb-0 pt-3 text-gray-700 text-xl">
                        {highestToken}
                    </div>
                    <div slot="actions">
                        <div class="p-2">
                            <Button text on:click={handleRowCreate}>Add Counter</Button>
                        </div>
                        <div class="p-2">
                            <Button text on:click={handleBoardClear}>Clear Board</Button>
                        </div>
                    </div>
                </Card.Card>
            </div>
        </div>
    </div>
</section>
