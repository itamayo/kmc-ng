import { Component, OnInit, OnDestroy } from '@angular/core';
import { KalturaMediaType } from '@kaltura-ng2/kaltura-api/types';
import { EntryStore, ActionTypes } from '../entry-store/entry-store.service';
import { EntrySectionsListHandler } from './entry-sections-list/entry-sections-list-handler';
import { EntryMetadataHandler } from './entry-metadata/entry-metadata-handler';
import { EntryPreviewHandler } from './entry-preview/entry-preview-handler';
import { EntryCaptionsHandler } from './entry-captions/entry-captions-handler';
import { EntryAccessControlHandler } from './entry-access-control/entry-access-control-handler';
import { EntryClipsHandler } from './entry-clips/entry-clips-handler';
import { EntryRelatedHandler } from './entry-related/entry-related-handler';
import { EntryLiveHandler } from './entry-live/entry-live-handler';
import { EntryFlavoursHandler } from './entry-flavours/entry-flavours-handler';
import { EntryThumbnailsHandler } from './entry-thumbnails/entry-thumbnails-handler';
import { EntrySchedulingHandler } from './entry-scheduling/entry-scheduling-handler';
import { EntryUsersHandler } from './entry-users/entry-users-handler';
import { EntriesStore } from '../entries-store/entries-store.service';
import { EntrySectionsManager } from '../entry-store/entry-sections-manager';


@Component({
    selector: 'kEntry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss'],
	providers : [
		EntryStore,
		EntrySectionsManager,
		EntrySectionsListHandler,
		EntryPreviewHandler,
		EntryMetadataHandler,
		EntryAccessControlHandler,
		EntryCaptionsHandler,
		EntryClipsHandler,
		EntryFlavoursHandler,
		EntryLiveHandler,
		EntryRelatedHandler,
		EntrySchedulingHandler,
		EntryThumbnailsHandler,
		EntryUsersHandler
	]
})
export class EntryComponent implements OnInit, OnDestroy {

	_entryName: string;
	_entryType: KalturaMediaType;

	public _loading = false;
	public _loadingError = null;
	public _currentEntryId : string;
	public _enablePrevButton : boolean;
	public _enableNextButton : boolean;

    constructor(public _entryStore: EntryStore,
	private  _entriesStore : EntriesStore) {

    }

    ngOnDestroy()
	{
	}

	private _updateNavigationState()
	{
		const entries = this._entriesStore.entries;
		if (entries && this._currentEntryId) {
			const currentEntry = entries.find(entry => entry.id === this._currentEntryId);
			const currentEntryIndex =  currentEntry ? entries.indexOf(currentEntry) : -1;
			this._enableNextButton = currentEntryIndex >= 0 && (currentEntryIndex < entries.length -1);
			this._enablePrevButton = currentEntryIndex > 0;

		}else
		{
			this._enableNextButton = false;
			this._enablePrevButton = false;
		}
	}

    ngOnInit() {

    	this._entryStore.entry$
            .cancelOnDestroy(this)
            .subscribe(
			entry =>
			{
				if (entry) {
					this._entryName = entry.name;
					this._entryType = entry.mediaType;
					this._loading = false;
					this._loadingError = null;
				}
			});

		this._entryStore.status$
			.cancelOnDestroy(this)
			.subscribe(
			status => {
				if (status)
				{
					switch (status.action)
					{
						case ActionTypes.EntryLoading:
							this._loading = true;
							this._loadingError = null;

							// when loading new entry in progress, the 'entryID' property
							// reflect the entry that is currently being loaded
							// while 'entry$' stream is null
							this._currentEntryId = this._entryStore.entryId;
							this._updateNavigationState();
							break;
						case ActionTypes.EntryLoaded:
							this._loading = false;
							break;
						case ActionTypes.EntryLoadingFailed:
							// TODO [kmcng] show retry only if network connectivity
							this._loading = false;
							this._loadingError = { message : status.error.message, buttons : { returnToEntries : 'Back To Entries', retry : 'Retry'}};
							break;
						case ActionTypes.EntrySaving:
							break;
						case ActionTypes.EntrySavingFailed:
							break;
						case ActionTypes.NavigateOut:
							this._loading = true;
							break;
						default:
							break;
					}
				}
			},
			error =>
			{
				// TODO [kmc] navigate to error page
				throw error;
			});
    }

    public _backToList(){
    	this._entryStore.returnToEntries();
    }

    public _save()
	{
		this._entryStore.saveEntry();
	}

    public _navigateToPrevious() : void
	{
		const entries = this._entriesStore.entries;

		if (entries && this._currentEntryId) {
			const currentEntry = entries.find(entry => entry.id === this._currentEntryId);
			const currentEntryIndex =  currentEntry ? entries.indexOf(currentEntry) : -1;
			if (currentEntryIndex > 0)
			{
				const prevEntry = entries[currentEntryIndex-1];
				this._entryStore.openEntry(prevEntry.id);
			}
		}
	}

	public _navigateToNext() : void
	{
		const entries = this._entriesStore.entries;

		if (entries && this._currentEntryId) {
			const currentEntry = entries.find(entry => entry.id === this._currentEntryId);
			const currentEntryIndex =  currentEntry ? entries.indexOf(currentEntry) : -1;
			if (currentEntryIndex >= 0 && (currentEntryIndex < entries.length -1))
			{
				const nextEntry = entries[currentEntryIndex+1];
				this._entryStore.openEntry(nextEntry.id);
			}
		}
	}

	public _onLoadingAction(actionKey : string)
	{
		if (actionKey === 'returnToEntries')
		{
			this._entryStore.returnToEntries({force:true});
		}else if (actionKey == 'retry')
		{

		}
	}

}
