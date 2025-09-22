<!--
.. title: Booting Vagrant boxes with UEFI on Fedora: Permission denied
.. slug: booting-vagrant-boxes-with-uefi-on-fedora-permission-denied
.. date: 2025-09-22 10:37:23 UTC
.. tags: english,linux,planet-debian,software,selinux
.. category: 
.. link: 
.. description: 
.. type: text
-->

If you're still using Vagrant (I am) and try to boot a box that uses UEFI (like [`boxen/debian-13`](https://portal.cloud.hashicorp.com/vagrant/discover/boxen/debian-13)),
a simple `vagrant init boxen/debian-13` and `vagrant up` will entertain you with a nice traceback:

```console
% vagrant up
Bringing machine 'default' up with 'libvirt' provider...
==> default: Checking if box 'boxen/debian-13' version '2025.08.20.12' is up to date...
==> default: Creating image (snapshot of base box volume).
==> default: Creating domain with the following settings...
==> default:  -- Name:              tmp.JV8X48n30U_default
==> default:  -- Description:       Source: /tmp/tmp.JV8X48n30U/Vagrantfile
==> default:  -- Domain type:       kvm
==> default:  -- Cpus:              1
==> default:  -- Feature:           acpi
==> default:  -- Feature:           apic
==> default:  -- Feature:           pae
==> default:  -- Clock offset:      utc
==> default:  -- Memory:            2048M
==> default:  -- Loader:            /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd
==> default:  -- Nvram:             /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/efivars.fd
==> default:  -- Base box:          boxen/debian-13
==> default:  -- Storage pool:      default
==> default:  -- Image(vda):        /home/evgeni/.local/share/libvirt/images/tmp.JV8X48n30U_default.img, virtio, 20G
==> default:  -- Disk driver opts:  cache='default'
==> default:  -- Graphics Type:     vnc
==> default:  -- Video Type:        cirrus
==> default:  -- Video VRAM:        16384
==> default:  -- Video 3D accel:    false
==> default:  -- Keymap:            en-us
==> default:  -- TPM Backend:       passthrough
==> default:  -- INPUT:             type=mouse, bus=ps2
==> default:  -- CHANNEL:             type=unix, mode=
==> default:  -- CHANNEL:             target_type=virtio, target_name=org.qemu.guest_agent.0
==> default: Creating shared folders metadata...
==> default: Starting domain.
==> default: Removing domain...
==> default: Deleting the machine folder
/usr/share/gems/gems/fog-libvirt-0.13.1/lib/fog/libvirt/requests/compute/vm_action.rb:7:in 'Libvirt::Domain#create': Call to virDomainCreate failed: internal error: process exited while connecting to monitor: 2025-09-22T10:07:55.081081Z qemu-system-x86_64: -blockdev {"driver":"file","filename":"/home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd","node-name":"libvirt-pflash0-storage","auto-read-only":true,"discard":"unmap"}: Could not open '/home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd': Permission denied (Libvirt::Error)
	from /usr/share/gems/gems/fog-libvirt-0.13.1/lib/fog/libvirt/requests/compute/vm_action.rb:7:in 'Fog::Libvirt::Compute::Shared#vm_action'
	from /usr/share/gems/gems/fog-libvirt-0.13.1/lib/fog/libvirt/models/compute/server.rb:81:in 'Fog::Libvirt::Compute::Server#start'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/start_domain.rb:546:in 'VagrantPlugins::ProviderLibvirt::Action::StartDomain#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/set_boot_order.rb:22:in 'VagrantPlugins::ProviderLibvirt::Action::SetBootOrder#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/share_folders.rb:22:in 'VagrantPlugins::ProviderLibvirt::Action::ShareFolders#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/prepare_nfs_settings.rb:21:in 'VagrantPlugins::ProviderLibvirt::Action::PrepareNFSSettings#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/synced_folders.rb:87:in 'Vagrant::Action::Builtin::SyncedFolders#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/delayed.rb:19:in 'Vagrant::Action::Builtin::Delayed#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/synced_folder_cleanup.rb:28:in 'Vagrant::Action::Builtin::SyncedFolderCleanup#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/plugins/synced_folders/nfs/action_cleanup.rb:25:in 'VagrantPlugins::SyncedFolderNFS::ActionCleanup#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/prepare_nfs_valid_ids.rb:14:in 'VagrantPlugins::ProviderLibvirt::Action::PrepareNFSValidIds#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:127:in 'block in Vagrant::Action::Warden#finalize_action'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builder.rb:180:in 'Vagrant::Action::Builder#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'block in Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/util/busy.rb:19:in 'Vagrant::Util::Busy.busy'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/call.rb:53:in 'Vagrant::Action::Builtin::Call#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:127:in 'block in Vagrant::Action::Warden#finalize_action'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builder.rb:180:in 'Vagrant::Action::Builder#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'block in Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/util/busy.rb:19:in 'Vagrant::Util::Busy.busy'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/call.rb:53:in 'Vagrant::Action::Builtin::Call#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/create_network_interfaces.rb:197:in 'VagrantPlugins::ProviderLibvirt::Action::CreateNetworkInterfaces#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/create_networks.rb:40:in 'VagrantPlugins::ProviderLibvirt::Action::CreateNetworks#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/create_domain.rb:452:in 'VagrantPlugins::ProviderLibvirt::Action::CreateDomain#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/resolve_disk_settings.rb:143:in 'VagrantPlugins::ProviderLibvirt::Action::ResolveDiskSettings#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/create_domain_volume.rb:97:in 'VagrantPlugins::ProviderLibvirt::Action::CreateDomainVolume#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/handle_box_image.rb:127:in 'VagrantPlugins::ProviderLibvirt::Action::HandleBoxImage#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/handle_box.rb:56:in 'Vagrant::Action::Builtin::HandleBox#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/handle_storage_pool.rb:63:in 'VagrantPlugins::ProviderLibvirt::Action::HandleStoragePool#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/set_name_of_domain.rb:34:in 'VagrantPlugins::ProviderLibvirt::Action::SetNameOfDomain#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/provision.rb:80:in 'Vagrant::Action::Builtin::Provision#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-libvirt-0.11.2/lib/vagrant-libvirt/action/cleanup_on_failure.rb:21:in 'VagrantPlugins::ProviderLibvirt::Action::CleanupOnFailure#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:127:in 'block in Vagrant::Action::Warden#finalize_action'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builder.rb:180:in 'Vagrant::Action::Builder#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'block in Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/util/busy.rb:19:in 'Vagrant::Util::Busy.busy'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/call.rb:53:in 'Vagrant::Action::Builtin::Call#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/box_check_outdated.rb:93:in 'Vagrant::Action::Builtin::BoxCheckOutdated#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builtin/config_validate.rb:25:in 'Vagrant::Action::Builtin::ConfigValidate#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/warden.rb:48:in 'Vagrant::Action::Warden#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/builder.rb:180:in 'Vagrant::Action::Builder#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'block in Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/util/busy.rb:19:in 'Vagrant::Util::Busy.busy'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/action/runner.rb:101:in 'Vagrant::Action::Runner#run'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/machine.rb:248:in 'Vagrant::Machine#action_raw'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/machine.rb:217:in 'block in Vagrant::Machine#action'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/environment.rb:631:in 'Vagrant::Environment#lock'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/machine.rb:203:in 'Method#call'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/machine.rb:203:in 'Vagrant::Machine#action'
	from /usr/share/vagrant/gems/gems/vagrant-2.3.4/lib/vagrant/batch_action.rb:86:in 'block (2 levels) in Vagrant::BatchAction#run'
```

The important part here is
```
Call to virDomainCreate failed: internal error: process exited while connecting to monitor:
2025-09-22T10:07:55.081081Z qemu-system-x86_64: -blockdev {"driver":"file","filename":"/home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd","node-name":"libvirt-pflash0-storage","auto-read-only":true,"discard":"unmap"}:
Could not open '/home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd': Permission denied (Libvirt::Error)
```

Of course we checked that the file permissions on this file are correct (I'll save you the `ls` output), so what's next?
Yes, of course, SELinux!

```console
# ausearch -m AVC
time->Mon Sep 22 12:07:55 2025
type=AVC msg=audit(1758535675.080:1613): avc:  denied  { read } for  pid=257204 comm="qemu-system-x86" name="OVMF_CODE.fd" dev="dm-2" ino=1883946 scontext=unconfined_u:unconfined_r:svirt_t:s0:c352,c717 tcontext=unconfined_u:object_r:user_home_t:s0 tclass=file permissive=0
```

A process in the `svirt_t` domain tries to access something in the `user_home_t` domain and is denied by the kernel.
So far, SELinux is both working as designed and preventing us from doing our work, nice.

For "normal" (non-UEFI) boxes, Vagrant uploads the image to libvirt, which stores it in `~/.local/share/libvirt/images/` and boots fine from there.
For UEFI boxen, one also needs `loader` and `nvram` files, which Vagrant keeps in `~/.vagrant.d/boxes/<box_name>` and that's what explodes in our face here.

As `~/.local/share/libvirt/images/` works well, and is labeled `svirt_home_t` let's see what other folders use that label:

```console
# semanage fcontext -l |grep svirt_home_t
/home/[^/]+/\.cache/libvirt/qemu(/.*)?             all files          unconfined_u:object_r:svirt_home_t:s0
/home/[^/]+/\.config/libvirt/qemu(/.*)?            all files          unconfined_u:object_r:svirt_home_t:s0
/home/[^/]+/\.libvirt/qemu(/.*)?                   all files          unconfined_u:object_r:svirt_home_t:s0
/home/[^/]+/\.local/share/gnome-boxes/images(/.*)? all files          unconfined_u:object_r:svirt_home_t:s0
/home/[^/]+/\.local/share/libvirt/boot(/.*)?       all files          unconfined_u:object_r:svirt_home_t:s0
/home/[^/]+/\.local/share/libvirt/images(/.*)?     all files          unconfined_u:object_r:svirt_home_t:s0
```

Okay, that all makes sense, and it's just missing the Vagrant-specific folders!

```console
# semanage fcontext -a -t svirt_home_t '/home/[^/]+/\.vagrant.d/boxes(/.*)?'
```

Now relabel the Vagrant boxes:

```console
% restorecon -rv ~/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13 from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/metadata_url from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12 from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/box_0.img from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/metadata.json from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/Vagrantfile from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_VARS.fd from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/box_update_check from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
Relabeled /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/efivars.fd from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:svirt_home_t:s0
```

And it works!

```console
% vagrant up
Bringing machine 'default' up with 'libvirt' provider...
==> default: Checking if box 'boxen/debian-13' version '2025.08.20.12' is up to date...
==> default: Creating image (snapshot of base box volume).
==> default: Creating domain with the following settings...
==> default:  -- Name:              tmp.JV8X48n30U_default
==> default:  -- Description:       Source: /tmp/tmp.JV8X48n30U/Vagrantfile
==> default:  -- Domain type:       kvm
==> default:  -- Cpus:              1
==> default:  -- Feature:           acpi
==> default:  -- Feature:           apic
==> default:  -- Feature:           pae
==> default:  -- Clock offset:      utc
==> default:  -- Memory:            2048M
==> default:  -- Loader:            /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/OVMF_CODE.fd
==> default:  -- Nvram:             /home/evgeni/.vagrant.d/boxes/boxen-VAGRANTSLASH-debian-13/2025.08.20.12/libvirt/efivars.fd
==> default:  -- Base box:          boxen/debian-13
==> default:  -- Storage pool:      default
==> default:  -- Image(vda):        /home/evgeni/.local/share/libvirt/images/tmp.JV8X48n30U_default.img, virtio, 20G
==> default:  -- Disk driver opts:  cache='default'
==> default:  -- Graphics Type:     vnc
==> default:  -- Video Type:        cirrus
==> default:  -- Video VRAM:        16384
==> default:  -- Video 3D accel:    false
==> default:  -- Keymap:            en-us
==> default:  -- TPM Backend:       passthrough
==> default:  -- INPUT:             type=mouse, bus=ps2
==> default:  -- CHANNEL:             type=unix, mode=
==> default:  -- CHANNEL:             target_type=virtio, target_name=org.qemu.guest_agent.0
==> default: Creating shared folders metadata...
==> default: Starting domain.
==> default: Domain launching with graphics connection settings...
==> default:  -- Graphics Port:      5900
==> default:  -- Graphics IP:        127.0.0.1
==> default:  -- Graphics Password:  Not defined
==> default:  -- Graphics Websocket: 5700
==> default: Waiting for domain to get an IP address...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 192.168.124.157:22
    default: SSH username: vagrant
    default: SSH auth method: private key
    default:
    default: Vagrant insecure key detected. Vagrant will automatically replace
    default: this with a newly generated keypair for better security.
    default:
    default: Inserting generated public key within guest...
    default: Removing insecure key from the guest if it's present...
    default: Key inserted! Disconnecting and reconnecting using new SSH key...
==> default: Machine booted and ready!
```
