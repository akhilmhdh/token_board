<script>
	import store from '../store/socket.js';
	let messages = [];
	let message = 'something fishy';
	import { onMount } from 'svelte';

	onMount(() => {
		store.subscribe(currentMessage => {
			messages = [...messages, currentMessage];
		})
	})

	function onSendMessage() {
		if (message.length > 0) {
			store.sendMessage(message);

		}
	}
</script>

<h1>Hello World</h1>
<button on:click={onSendMessage}>
	Send Message
</button>