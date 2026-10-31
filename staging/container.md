# Local container

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

A collaborator runs the verifier inside a container. Ubuntu is preferred. On Windows, use WSL. The process is not violated.

## Ubuntu

```
docker run --rm -v "$PWD":/work -w /work ubuntu:24.04 bash -c "apt-get update && apt-get install -y nodejs && node pipeline/verify.mjs examples/sample-component"
```

## Windows with WSL

Install WSL. Open an Ubuntu shell. Run the same command. Do not run the verifier directly on the Windows host.

## What the container does

It isolates the component. A malicious component cannot read the host. The container is discarded after the run.
