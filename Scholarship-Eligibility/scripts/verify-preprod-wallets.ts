import fetch from 'node-fetch';

export interface UserEntry {
  id: number;
  name: string;
  address: string;
}

export const USER_ENTRIES: UserEntry[] = [
  { id: 1, name: "Niki Biradar", address: "mn_addr_preprod1lwzdqj0g37jlgd5dxt8feq890fl3fp9uxnzzx8j0q95x09k5yrcsm3p9we" },
  { id: 2, name: "Shridevi", address: "mn_addr_preprod1mr2hfunq20a5np77uwjcuzmjfje37pjg607f7d0v58ec7kma4y4srq9u7q" },
  { id: 3, name: "Mugda", address: "mn_addr_preprod150akje7dptkcdysn4d50s3gtxrkhcs3yxpx6xakue5cp6nwl056s7vqesw" },
  { id: 4, name: "Suraj", address: "mn_addr_preprod1mt54nfgx07u275juxcvvmvach9t0k7f54y327k5ahpj50nd8nn2qs8jp85" },
  { id: 5, name: "Kirti", address: "mn_addr_preprod1ascfyaqzcv90j9qd6rtnkzamn730ufqscew9nww3fd4xvte8nntq6yx2lv" },
  { id: 6, name: "Preeti", address: "mn_addr_preprod1rtjkv6jazdd3azqezs7w8lty32vx9maq8gep7zstfl3cg7q8svhqeen93e" },
  { id: 7, name: "sudhakar sutar", address: "mn_addr_preprod124s8sdns9rhxs9uljqfgvyshkjh82aq0dan74canwrfw6jt5ktjs7gey40" },
  { id: 8, name: "Vaishnavi Raut", address: "mn_addr_preprod1q7rk3uvc7h76dkujeq5n8dgd2syhw3rx0jwew8phhjfvxq4a059qd3pj97" },
  { id: 9, name: "Samruddhi Nevse", address: "mn_addr_preprod12zrjk4pnvfka2ak4fz8v6jkv552pg3nf80r7gagjht9e9dd6wncsesfnuh" },
  { id: 10, name: "Pooja Kohinkar", address: "mn_addr_preprod183323eryp4yajzrqmc7uagn" },
  { id: 11, name: "Srushti Chakradhar Benjarge", address: "mn_addr_preprod1au9ua4scr0v962dw6gr00mnu2cdexrdwmyvvvkhjfu0rs645wmssvexs86" },
  { id: 12, name: "Ankita", address: "mn_addr_preprod1zj6vz2zjwmx58gfhyamp7dpnn3jhpfvhlms7rac2fksha8wy4vcq2xwuuq" },
  { id: 13, name: "Pratiksha Kalbhor", address: "mn_addr_preprod1yccfqe5up5g847f3rg5qktev5hz8dvzghe58fn95qpgyekzh96dsk7psx0" },
  { id: 14, name: "Nayan Palande", address: "mn_addr1seyst82p5kqzt7k2pe2lv09d9e75lwsmltvf7eea8xwypn0j5ynqgkqgst" },
  { id: 15, name: "Simran Rupesh Sawant", address: "mn_addr_preprod1ftfdf2a2fpf480dte5hhderu73sfs3j9n5zjgfdjc4kahwyy6zsqlmpe7c" },
  { id: 16, name: "Sanskruti Chavan", address: "mn_addr_preprod1g0v8ay42g30hd7fqyppccglk67wzyq0hfazak207tuf7cevkta8qggh7yc" },
  { id: 17, name: "Renuka", address: "mn_addr_preprod1lhxxk0yxtecjc3elkj4242f88qh8pdrgxfyumet7tng88rq2q9ms0dx88f" },
  { id: 18, name: "Baswaraj Biradar", address: "mn_addr_preprod1f3t5h0jr9hmxdxeaklws9dxaux4k68eumkm0cve60jauzv6dk04q7r9qtd" },
  { id: 19, name: "Shivling umate", address: "mn_addr_preprod1jz686t708rgksy0enhhet8reamh9g902q8626p3dck4n4p0y3pmsrhfqz9" },
  { id: 20, name: "Vivek Bedre", address: "mn_dust_preprod1wdlard9k90z4p3khjweyv3ngu4lh7kujknmknzqsc7pa769t937r6vcxfsd" },
  { id: 21, name: "Varsha", address: "mn_addr_preprod1ffa9hhch66dlhgk6vdtkaguwehq75ky7krka59ehgn9wu7azwelqyps0am" },
  { id: 22, name: "Baswaraj Patil", address: "mn_addr_preprod1ce4kd3lct6ac7mxdyazh4x9juk3jjhj9q9xrdr2gnwe6mxwf0h3shcv5dx" },
  { id: 23, name: "Sanskruti Borade", address: "mn_dust_preprod1wv7ewem9xg4m0wxp2czjd93jhl3gmz4jk6mxqzacjk5qh7kxjfjpc2uknf7" },
  { id: 24, name: "Tejaswini", address: "mn_addr_preprod1zjeskf6g9mjd3svhux0an807x6tcdvcrpe3hwm9rdnp52m3cmyjqwm4q73" },
  { id: 25, name: "Tirupati", address: "mn_addr_preprod1ef28tjt6ndghnm8jqq9umdsvqxwgwurp6xz8l8464epmdsetxgusdg8rm7" },
  { id: 26, name: "Snehal", address: "mn_addr_preprod19n885sxay3nhnurs48lhx9arhj902texa0urlyxmfsgnvvhk7a4s39ahyr" },
  { id: 27, name: "Shreeniwas", address: "mn_addr_preprod17rzu7fq5zsynta5lcxupwwcf6jw2l3zxlzzlg5k7y8mfyjwrdftsteqn2p" },
  { id: 28, name: "Ajay", address: "mn_addr_preprod1utg2f8vhqkce4ueh9yw0tv5kfzf2088f5wpflwjdzvkf7xnqwg8qf3vtrl" },
  { id: 29, name: "Aditya", address: "mn_addr_preprod18dhc7jj5wdjkde3eun3wu7y6jcpw6m26puskn43p3j8280t6xvwqlqvqvy" },
  { id: 30, name: "Sanskruti", address: "mn_addr_preprod1z7yazhn0vc7qg2syt2tmunwkpp0fgeef634tklu9hq9c8p53xu2qcxt53w" },
  { id: 31, name: "Riddhi", address: "mn_addr_preprod1rv2hgk5rkfe7stdwyawmkmyypetq22qjgvnz494wyjtdjaffn04qelj2p8" },
  { id: 32, name: "Jivika", address: "mn_addr_preprod1v0nmdejdzx8elwyffxkrgqlltsh9qnnz779jv8wvqf4s3c3ym3astzlwax" },
  { id: 33, name: "Renuka", address: "mn_addr_preprod1gwm56ja78yckzcnzvwwdpkunj7zrvzukqgqzn9t4qcygyrs3q4tqv5shr8" },
  { id: 34, name: "Shradha", address: "mn_addr_preprod1e7dja9kgkhc254ge9vmwvk7j8jtu0zgrjxqg3shkrd8sxzqz92qqg0uhq6" },
  { id: 35, name: "Purva", address: "mn_addr_preprod1ypewj6kjqmrqz6w6h3qsxrzaytztcycjxgzhw0a49w2tayqnsasqvql7mz" },
  { id: 36, name: "Shravani", address: "mn_addr_preprod12hvfvkgpgsz40xqz5e3ehe38l5xmdqthd0ugvtwsvvnuqjrk0rmq08279f" },
  { id: 37, name: "Arpita balaji shinde", address: "mn_addr_preprod15gyuf9dzt67pf64n4xvcwxy3xwdj2vcnshsprvhe9xku0u08lp7q5u2kk7" },
  { id: 38, name: "Snehal Gaikwad", address: "mn_addr_preprod12whlsam27jlf7u6vpa5ajmgtqp3sgfrp8v65f2433wd2cyxxkcsspkxgp7" },
  { id: 39, name: "Kshitija", address: "mn_addr_preprod1mv7qj3lyxzwce88rp4hnexzd4vp3r84mdamsp888rcvsgtatk7dqxlp37s" },
  { id: 40, name: "Vaishnavi vasant lambhate", address: "mn_addr_preprod1tuy6nmlwgd3tyq83aq3ma6n8v69s6trv6glhp2wu9thyud26463qgrzhmn" },
  { id: 41, name: "Vishvajit Bhagave", address: "mn_addr_preprod1nnja870gsusuk3xrl0q7vrp4wh9ucaw7nvx647t2s2hl6v444t8s6pzckh" },
  { id: 42, name: "Amir Saudagar", address: "mn_addr_preview19ekd8mrdu033qn6hveju9f2k9vt6an5nrgnr74rvxw589avc3xwstujjxl" },
  { id: 43, name: "Samiksha", address: "mn_addr_preprod1yk8fq44yr3fmskjr20z33rl5la39sv5u4he49zewmse4mu76qwpqrtrg4g" },
  { id: 44, name: "Payal Babar", address: "mn_addr_preprod1s3uf80npv6gkkpcvrunxcrzmfdvxy95fx03ej568scjsxa2ly2hq9q36em" },
  { id: 45, name: "Paras Babar", address: "mn_addr_preprod152xkl0t2tet25l0n08xkgzsfe907stqw45qj04nq08l8qsd4lcfqm55c9r" },
  { id: 46, name: "Karn babar", address: "mn_addr_preprod1cwtsm6mjm0ygeu4a8lankwhurgenflvsrhwkhyl9p4r8u9a9dxus95c8qd" },
  { id: 47, name: "Harshal Tatyasaheb Jagdale", address: "mn_addr_preprod1nzd28acpu2mrgrlegeu3jts8pd3ldvr2jwxsvck9435jsj3yvnqqt5rdw8" },
  { id: 48, name: "Abhira", address: "mn_addr_preprod1huj2sln7s3zxf07smjhvluwhhn204yler0njcq5ag8pl8jfvhm8sgr4dce" },
  { id: 49, name: "Radha", address: "mn_addr_preprod10ez9fznjjlukufy7g3edzlr7f0nwez58ug8xk0f0vvu68u5yf0ussf4y9y" },
  { id: 50, name: "Swara", address: "mn_addr_preprod1kw3jay7unzl75yg05npens9e9jumjqfqzywp2mjzuss67t65khlszvqdug" },
  { id: 51, name: "Mukta", address: "mn_addr_preprod1v7tdfw7zq6mnqekjz2rdxyryug4j7j5zwv8pgqnqyrle2g4ttvvshfpptw" }
];

export interface VerificationResult {
  id: number;
  name: string;
  shortenedAddress: string;
  fullAddress: string;
  format: string;
  preprodCheck: string;
  onChainEvidence: string;
  contractEvidence: string;
  status: string;
}

export function shortenAddress(addr: string): string {
  if (!addr || addr.length <= 20) return addr;
  return `${addr.slice(0, 16)}...${addr.slice(-6)}`;
}

export function classifyFormat(addr: string): { format: string; preprodCheck: string } {
  if (addr.length < 50) {
    return { format: "Truncated/Incomplete", preprodCheck: "Failed (Incomplete string)" };
  }
  if (addr.startsWith("mn_addr_preprod1")) {
    return { format: "Shielded Preprod", preprodCheck: "Structurally Preprod" };
  }
  if (addr.startsWith("mn_dust_preprod1")) {
    return { format: "DUST Preprod", preprodCheck: "Structurally Preprod" };
  }
  if (addr.startsWith("mn_addr_preview1")) {
    return { format: "Preview Network", preprodCheck: "Failed (Preview Network)" };
  }
  if (addr.startsWith("mn_addr1")) {
    return { format: "Mainnet / Unspecified", preprodCheck: "Failed (Mainnet format)" };
  }
  return { format: "Unknown Format", preprodCheck: "Failed (Unknown format)" };
}

async function queryIndexerForOutputs(indexerUrl: string, ownerAddress: string): Promise<any> {
  const query = `
    query QueryUnshieldedOutputs($owner: HexEncoded!) {
      unshieldedOutputs(owner: $owner) {
        owner
        tokenType
        value
      }
    }
  `;
  try {
    const response = await fetch(indexerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { owner: ownerAddress } }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function runVerification(): Promise<VerificationResult[]> {
  const indexerUrl = process.env.MIDNIGHT_INDEXER_URL || "https://indexer.preprod.midnight.network/api/v3/graphql";
  const results: VerificationResult[] = [];

  for (const entry of USER_ENTRIES) {
    const { format, preprodCheck } = classifyFormat(entry.address);
    let onChainEvidence = "No observable on-chain record";
    let contractEvidence = "No contract interaction record";
    let status = "Pending Verification";

    if (preprodCheck !== "Structurally Preprod") {
      status = preprodCheck.includes("Incomplete") ? "Invalid (Truncated)" : "Invalid (Network mismatch)";
    } else {
      // Query indexer if valid structure
      const queryRes = await queryIndexerForOutputs(indexerUrl, entry.address);
      if (queryRes?.data?.unshieldedOutputs?.length > 0) {
        onChainEvidence = `Confirmed (${queryRes.data.unshieldedOutputs.length} outputs)`;
        status = "On-Chain Verified";
      } else {
        onChainEvidence = "Unconfirmed (Shielded / No public UTXO record on indexer)";
        status = "Requires On-Chain Proof";
      }
    }

    results.push({
      id: entry.id,
      name: entry.name,
      shortenedAddress: shortenAddress(entry.address),
      fullAddress: entry.address,
      format,
      preprodCheck,
      onChainEvidence,
      contractEvidence,
      status
    });
  }

  return results;
}

async function main() {
  console.log("==================================================");
  console.log("MIDNIGHT PREPROD WALLET VERIFICATION UTILITY");
  console.log("==================================================\n");

  const results = await runVerification();
  
  console.log("| # | Identifier | Wallet Address | Format | Preprod Check | On-chain Evidence | Status |");
  console.log("|---|---|---|---|---|---|---|");
  for (const r of results) {
    console.log(`| ${r.id} | ${r.name} | \`${r.shortenedAddress}\` | ${r.format} | ${r.preprodCheck} | ${r.onChainEvidence} | ${r.status} |`);
  }

  const preprodCount = results.filter(r => r.preprodCheck === "Structurally Preprod").length;
  const verifiedCount = results.filter(r => r.status === "On-Chain Verified").length;
  const nonPreprodCount = results.filter(r => r.format.includes("Mainnet") || r.format.includes("Preview")).length;
  const truncatedCount = results.filter(r => r.format.includes("Truncated")).length;

  console.log("\n==================================================");
  console.log("VERIFICATION SUMMARY");
  console.log("==================================================");
  console.log(`Total Responses Analyzed        : ${results.length}`);
  console.log(`Structurally Preprod Candidates : ${preprodCount}`);
  console.log(`On-Chain Verified               : ${verifiedCount}`);
  console.log(`Non-Preprod Addresses           : ${nonPreprodCount}`);
  console.log(`Truncated/Incomplete            : ${truncatedCount}`);
  console.log("--------------------------------------------------");
  if (verifiedCount < 50) {
    console.log("STATUS: 50-user requirement is NOT yet verified.");
  } else {
    console.log("STATUS: 50-user requirement IS verified.");
  }
}

main().catch(console.error);
