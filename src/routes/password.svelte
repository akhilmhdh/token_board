<script>
    import TextField from "smelte/src/components/TextField";
    import Button from "smelte/src/components/Button";
    import Card from "smelte/src/components/Card";
    import { goto } from "@sapper/app";

    import { password as passwordLocalStorageName } from "../const/localStorage";

    let password = "";

    const handleFormSubmit = (evt) => {
        evt.preventDefault();
        localStorage.setItem(passwordLocalStorageName, password);
        goto("/");
    };
</script>

<div class="flex w-screen h-screen items-center justify-center">
    <form on:submit={handleFormSubmit}>
        <Card.Card>
            <div slot="title">
                <Card.Title title="Please type your password" />
            </div>
            <div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">
                <TextField label="Password" type="password" outlined bind:value={password} />
            </div>
            <div slot="actions">
                <div class="p-2">
                    <Button text type="submit">Submit</Button>
                </div>
            </div>
        </Card.Card>
    </form>
</div>
