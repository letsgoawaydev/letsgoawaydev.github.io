async function getJavaData() {
    return await downloadJson("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
}

async function getBedrockData() {
    return await downloadJson("https://api.github.com/repos/mojang/bedrock-samples/releases?per_page=100")
}

async function downloadJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        return {};
    }
}

function setStatus(text) {
    console.log(text);
    document.getElementById("status").innerText = text;
}

let zip = new JSZip();
let versions = [];
let bedrockVersions = [];
let dropdown = document.createElement("select");
let checkbox = document.getElementById("showextras");
let content = document.getElementById("content");

async function init() {
    versions = [];
    let version_manifest_v2 = await getJavaData();
    versions = version_manifest_v2.versions;

    let bedrock_samples_releases = await getBedrockData();
    for (id in bedrock_samples_releases) {
        bedrockVersions.push(bedrock_samples_releases[id])
    }

    dropdown.id = "versiondropdown";
    document.getElementById("download").addEventListener("click", (ev) => {
        versionSelect(dropdown.children.item(dropdown.selectedIndex).value)
    })
    content.appendChild(dropdown);

    checkbox.addEventListener("change", (ev) => {
        addVersions(!checkbox.checked);
    });

    addVersions(true);
}

function addBedrockVersions(releaseOnly) {
    for (id in bedrockVersions) {
        let version = bedrockVersions[id];
        if (releaseOnly && version.name.includes("-preview")) {
            continue;
        }
        let option = document.createElement("option");
        option.value = version.zipball_url;
        option.innerText = "Bedrock " + version.name;
        option.classList.add("dropdownOption")
        dropdown.appendChild(option);
    }
}

function addVersions(releaseOnly) {
    checkbox.setAttribute("disabled", "")
    // Clear the previous options  
    document.querySelectorAll(".dropdownOption").forEach((node) => {
        node.remove();
    })

    for (id in versions) {
        let version = versions[id];

        if (releaseOnly && version.type != "release") {
            continue;
        }

        let option = document.createElement("option");
        option.value = version.url;
        option.innerText = "Java " + version.id;
        option.classList.add("dropdownOption")
        dropdown.appendChild(option);
    }
    checkbox.removeAttribute("disabled")

    addBedrockVersions(releaseOnly);
    setStatus("Waiting for download...")
}
init();

async function versionSelect(url) {
    if (url.includes("zipball")) {
        window.open(url, "_blank");
        return;
    }
    var zip = new JSZip();

    document.querySelectorAll(".asset").forEach((node) => {
        node.remove();
    })

    setStatus("Downloading version data...")
    let versionData = await downloadJson(url);

    setStatus("Downloading client jar...")
    // Extract from jar
    let jar = await JSZip.loadAsync(await JSZipUtils.getBinaryContent(versionData.downloads.client.url));
    for (const path of Object.keys(jar.files)) {
        if (path.endsWith(".class") || path.startsWith("META-INF")) {
            continue;
        }
        setStatus(`Extracted ${path} from client jar`)
        zip.file(path, await jar.file(path).async("base64"), { base64: true, createFolders: true })
    }

    // Download from Mojang
    let assetIndex = await downloadJson(versionData.assetIndex.url);
    if (document.getElementById("dlmojang").checked) {
        for (const location of Object.keys(assetIndex.objects)) {
            try {
                let path = location.includes("/") ? "assets/" + location : location;

                if (path.startsWith("assets/minecraft/sounds/") && !document.getElementById("downloadsounds").checked) {
                    continue;
                }

                if (path.startsWith("assets/minecraft/lang/") && !document.getElementById("downloadlangs").checked) {
                    continue;
                }
                setStatus(`Downloading ${path} from Mojang...`)

                let data = await JSZipUtils.getBinaryContent(getLinkOfObject(assetIndex.objects[location]));
                zip.file(path, data, { binary: true, createFolders: true })
            }
            catch (error) {
                alert("Error when downloading from Mojang! Not all files will be in the zip.")
                break;
            }
        }
        // getLinkOfObject(assetIndex.objects[path])
        // path.includes("/") ? "assets/" + path : path;
    }

    setStatus(`Building zip...`)
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            setStatus(`Done!`)

            saveAs(content, `assets-${dropdown.children.item(dropdown.selectedIndex).innerText}.zip`);
        })
}

function getLinkOfObject(obj) {
    let hash = obj.hash;
    let dir = hash.substring(0, 2);
    return "https://api.allorigins.win/raw?url=" + `https://resources.download.minecraft.net/${dir}/${hash}`;
}