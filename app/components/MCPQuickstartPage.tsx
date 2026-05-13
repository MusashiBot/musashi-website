export default function MCPQuickstartPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#07090D]">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-8 border-b border-[#FFFFFF14] bg-[#07090D]/95 px-6 py-4 backdrop-blur md:px-10 lg:px-[80px]">
        <a href="/" className="font-jetbrains text-[20px] font-bold tracking-[1px] text-white md:text-[22px]">
          MUSASHI
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/quickstart" className="font-jetbrains text-xs font-medium text-white">
            QUICKSTART
          </a>
          <a href="/ai" className="font-jetbrains text-xs font-medium text-[#9CA3AF] transition-colors hover:text-white">
            API
          </a>
          <a href="https://musashitechnologiesllc.mintlify.app/tools/overview" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs font-medium text-[#9CA3AF] transition-colors hover:text-white">
            MCP TOOLS
          </a>
        </nav>
        <a
          href="https://musashitechnologiesllc.mintlify.app/quickstart"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#FFFFFF2A] bg-transparent px-5 py-[10px] transition-colors hover:bg-[#FFFFFF10]"
        >
          <span className="font-jetbrains text-xs font-bold text-white">Registry Docs</span>
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-[1320px] gap-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <aside className="sticky top-[88px] hidden h-fit w-[260px] shrink-0 border border-[#FFFFFF14] bg-[#0B0F16] p-4 lg:block">
          <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.18em] text-[#7E899B]">Quickstart</p>
          <nav className="flex flex-col gap-2">
            <a href="#step1" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 1: Choose Access</a>
            <a href="#step2" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 2: Get API Key</a>
            <a href="#step3" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 3: Connect Claude</a>
            <a href="#step4" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 4: Connect ChatGPT</a>
            <a href="#step5" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 5: First Query</a>
            <a href="#step6" className="border border-[#FFFFFF14] bg-[#FFFFFF05] px-3 py-2 font-jetbrains text-[11px] text-[#D1D5DB] hover:bg-[#FFFFFF10]">Step 6: Troubleshooting</a>
          </nav>
        </aside>

        <section className="w-full max-w-[900px] space-y-6">
          <div className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <h1 className="font-grotesk text-[38px] font-bold tracking-[-1px] text-white sm:text-[46px]">Quickstart</h1>
            <p className="mt-3 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">
              Get started with Musashi MCP. Set up Claude or ChatGPT in minutes, then query live prediction market intelligence.
            </p>
          </div>

          <article id="step1" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 1</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Choose how to access Musashi</h2>
            <p className="mt-3 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">Pick the connection style for your workflow.</p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border border-[#FFFFFF14] bg-[#070B11] p-4">
                <p className="font-grotesk text-[24px] font-semibold text-white">Claude MCP</p>
                <p className="mt-2 font-jetbrains text-[13px] leading-[1.7] text-[#A8B0BC]">Recommended path with OAuth + API key authorization.</p>
              </div>
              <div className="border border-[#FFFFFF14] bg-[#070B11] p-4">
                <p className="font-grotesk text-[24px] font-semibold text-white">Direct API</p>
                <p className="mt-2 font-jetbrains text-[13px] leading-[1.7] text-[#A8B0BC]">Use REST endpoints if you run your own agent runtime.</p>
              </div>
            </div>
          </article>

          <article id="step2" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 2</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Get your Musashi API key</h2>
            <p className="mt-3 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">
              You need a valid key with prefix <code className="text-white">mcp_sk_</code> for OAuth authorization.
            </p>
            <pre className="mt-4 overflow-x-auto border border-[#FFFFFF14] bg-[#05070D] p-4 font-jetbrains text-[12px] text-[#C7CFDA]">mcp_sk_...</pre>
            <a href="https://musashitechnologiesllc.mintlify.app/authentication" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex border border-[#FFFFFF24] bg-transparent px-4 py-2 font-jetbrains text-[11px] font-bold text-white hover:bg-[#FFFFFF10]">Open Authentication Guide →</a>
          </article>

          <article id="step3" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 3</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Connect Musashi to Claude</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">
              <li>Open Claude connector settings.</li>
              <li>Add a custom MCP server.</li>
              <li>Set endpoint to <code className="text-white">https://musashi-production.up.railway.app/mcp</code>.</li>
              <li>Select OAuth authentication.</li>
              <li>Enter your <code className="text-white">mcp_sk_...</code> key when prompted.</li>
            </ol>
          </article>

          <article id="step4" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 4</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Connect Musashi to ChatGPT</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">
              <li>Open <code className="text-white">Settings -&gt; Apps</code>.</li>
              <li>Create a custom app.</li>
              <li>Set MCP server URL to <code className="text-white">https://musashi-production.up.railway.app/mcp</code>.</li>
              <li>Keep authentication as OAuth.</li>
              <li>If asked for client ID, use <code className="text-white">chatgpt-musashi</code>.</li>
              <li>Complete authorization with your <code className="text-white">mcp_sk_...</code> key.</li>
            </ol>
          </article>

          <article id="step5" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 5</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Run your first query</h2>
            <div className="mt-4 space-y-3">
              <pre className="overflow-x-auto border border-[#FFFFFF14] bg-[#05070D] p-3 font-jetbrains text-[12px] text-[#C7CFDA]">Use the Musashi app to get health status.</pre>
              <pre className="overflow-x-auto border border-[#FFFFFF14] bg-[#05070D] p-3 font-jetbrains text-[12px] text-[#C7CFDA]">Use the Musashi app to get feed statistics.</pre>
              <pre className="overflow-x-auto border border-[#FFFFFF14] bg-[#05070D] p-3 font-jetbrains text-[12px] text-[#C7CFDA]">Use the Musashi app to analyze this text: Bitcoin will be above 150k by the end of 2026.</pre>
            </div>
          </article>

          <article id="step6" className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
            <p className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.14em] text-[#00FF88]">Step 6</p>
            <h2 className="mt-2 font-grotesk text-[30px] font-semibold text-white">Troubleshooting</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-jetbrains text-sm leading-[1.8] text-[#A8B0BC]">
              <li>Verify endpoint is exactly <code className="text-white">https://musashi-production.up.railway.app/mcp</code>.</li>
              <li>Ensure key starts with <code className="text-white">mcp_sk_</code> and has no extra spaces.</li>
              <li>If tools do not respond, disconnect and re-authorize.</li>
            </ul>
            <a href="https://musashitechnologiesllc.mintlify.app/reference/troubleshooting" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex border border-[#FFFFFF24] bg-transparent px-4 py-2 font-jetbrains text-[11px] font-bold text-white hover:bg-[#FFFFFF10]">Open Troubleshooting Guide →</a>
          </article>
        </section>
      </main>
    </div>
  );
}
