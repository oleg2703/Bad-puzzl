
document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const fragments = data.split('\n').map(line => line.trim()).filter(Boolean);
        const result = findLongestSequence(fragments);
        
        document.querySelector(".app").innerText = 'Найбільша послідовність: ' + result.join(', ');
        console.log('Найбільша послідовність:', result);
    };

    reader.readAsText(file);
}

// Функція для пошуку максимальної послідовності
function findLongestSequence(fragments) {
    let maxSequence = [];
    const graph = buildGraph(fragments);

    function buildGraph(fragments) {
        const graph = {};
        for (const fragment of fragments) {
            const key = fragment.slice(-2); 
            const value = fragment.slice(0, 2); 
            if (!graph[key]) graph[key] = [];
            graph[key].push(fragment);
        }
        return graph;
    }

    function dfs(currentPath, visited) {
        const lastFragment = currentPath[currentPath.length - 1];
        const lastTwoDigits = lastFragment.slice(-2);
        
        if (graph[lastTwoDigits]) {
            for (const nextFragment of graph[lastTwoDigits]) {
                if (!visited.has(nextFragment)) {
                    visited.add(nextFragment);
                    currentPath.push(nextFragment);

                    dfs(currentPath, visited);

                    currentPath.pop();
                    visited.delete(nextFragment);
                }
            }
        }

        if (currentPath.length > maxSequence.length) {
            maxSequence = [...currentPath];
        }
    }

    for (const fragment of fragments) {
        const visited = new Set([fragment]);
        dfs([fragment], visited);
    }

    return maxSequence;
}
