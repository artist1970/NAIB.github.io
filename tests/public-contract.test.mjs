import assert from "node:assert/strict";
import fs from "node:fs";

const contract = JSON.parse(fs.readFileSync(new URL("../config/public-contract.json", import.meta.url), "utf8"));
const boundary = JSON.parse(fs.readFileSync(new URL("../config/public-boundary.json", import.meta.url), "utf8"));
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const readme = fs.readFileSync(new URL("../README.md", import.meta.url), "utf8");

assert.equal(contract.schema, "naib-public-front-contract");
assert.equal(contract.release, "1.1.0-adit.1");
assert.equal(contract.identity.title, "Administrator");
assert.equal(contract.publicFront.canonical, true);
assert.equal(contract.publicFront.repository, "artist1970/NAIB.github.io");
assert.equal(contract.protectedRuntime.repository, "artist1970/noema-ai.github.io");
assert.equal(contract.protectedRuntime.publicDestination, false);
assert.equal(contract.privateGovernanceCore.browserFetchAllowed, false);
assert.equal(contract.routing.specialistRouter, "STOSCore");
assert.equal(contract.routing.proposalMediation, "ADIT-STOS");
assert.equal(contract.humanFinalAuthority, true);
assert.equal(contract.permissionSelfElevation, false);

assert.equal(boundary.authority, "public-guidance-and-proposal-only");
for (const denied of ["execute-shell", "mutate-repositories", "control-runtime", "proxy-stos-gateway-directly"]){
  assert.ok(boundary.publicMayNot.includes(denied), `missing deny rule: ${denied}`);
}

assert.match(html, /NAIB/);
assert.match(html, /Public Administrator/);
assert.match(html, /Human authority remains final/i);
assert.doesNotMatch(html, /127\.0\.0\.1:9844/);
assert.doesNotMatch(html, /STOS_ADMIN_TOKEN|ADIT_HMAC_SECRET|BEGIN PRIVATE KEY/);
assert.match(readme, /canonical public Administrator/i);
assert.match(readme, /NOEMA/i);

console.log("ALL NAIB PUBLIC CONTRACT TESTS PASS");
