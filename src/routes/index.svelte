<script>
	import store from '../store/socket.js';
	let messages = [];
	let message = 'something fishy';
	let counter = 0;
	let token = 0;
	let booths = new Array(10).fill({ counter: 0, token: 0 });
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

	let statistics = booths.flatMap((_, i) => (i % 2 == 0 ?
		{ counter1: booths?.[i].counter, token1: booths?.[i].token, counter2: booths?.[i + 1].counter, token2: booths[i + 1].token, }
		: []))

</script>

<style>
	section {
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		overflow: hidden;

	}

	td,
	th {
		border-top: 1px solid #ECF0F1;
		padding: 10px;
	}

	td {
		border-left: 1px solid #ECF0F1;
		border-right: 1px solid #ECF0F1;
	}

	th {
		background-color: #4ECDC4;
	}

	tr:nth-of-type(even) td {
		background-color: lighten(#4ECDC4, 35%);
	}

	.total th {
		background-color: white;
	}

	.total td {
		text-align: right;
		font-weight: 700;
	}

	.footer-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 1rem;
	}
</style>

<section>
	<div>
		<table>
			<thead>
				<tr class="table-headers">
					<th>Counter</th>
					<th>Token</th>
					<th>Counter</th>
					<th>Token</th>
				</tr>
			</thead>
			<tbody>
				{#each statistics as booth}
				<tr>
					<td>
						{booth.counter1}
					</td>
					<td>
						{booth.token1}
					</td>
					<td>
						{booth.counter2}
					</td>
					<td>
						{booth.token2}
					</td>
				</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="footer-bar">
		<input type="number" bind:value={counter} />
		<input type="number" bind:value={token} />
		<button on:click={onSendMessage}>
			Send Message
		</button>
	</div>
</section>