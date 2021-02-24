1. `git clone [repo]`
1. `npm i`
1. Change `config.json` as needed (if not set, then `config.example.json` will be used instead)
1. Run scripts:
    1. `npm run fetch` to start recording; data will be saved inside `/data` 
    1. `npm run replay -- [path_to_saved_data]` to replay the recorded data (`path_to_saved_data` should be a relative path to the root of the repo)
