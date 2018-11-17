import { Component, OnInit } from '@angular/core';
import { HttpService, Model } from 'src/app/http.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/_models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestService } from '../request.service';

@Component({
	selector: 'app-item-details',
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

	constructor (
		protected http: HttpService,
		protected alert: AlertService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected request: RequestService,
	) { }

	paramSub:	Subscription;
	qparamSub:	Subscription;
	qparams:	Params;
	item: Item;


	ngOnInit() {
		// listen to changes in URL params
		this.paramSub = this.route.params.subscribe (
			params => this.loadItem ( +params.id )
		);

		// listen to changes in query params
		this.qparams = { requested: '0' };
		this.qparamSub = this.route.queryParams.subscribe (
			params => this.qparams = params
		)
	}

	/**
	 * Given an item id, request more info about that item
	 * @param id item id
	 */
	loadItem ( id: number ) : void {
		let path: string = `/items/${id}`;
		this.http.getObservable ( path ).subscribe (
			data => {
				this.item = new Item(data);
				console.log ( 'loadItem', this.item, id==data['id'] );
			},
			(err: HttpErrorResponse) => 
				this.http.genericModelErrorHandler(err, Model.Item)
		);
	}


	/**
	 * Submit a request to borrow an item
	 */
	requestItem () : void {
		this.request.requestItem ( +this.item.id ).subscribe (
			res => {
				console.log ('requestItem', res);

				// 'navigate' to add queryparam 'requested=true'
				let extras: NavigationExtras = {
					queryParams: { requested: 1 }
				}
				this.router.navigate ([], extras );
			},
			(err: HttpErrorResponse) =>
				this.handleHttpError (err)
				// this.http.genericModelErrorHandler(err, Model.Item)
		)
	}

	/**
	 * Specialized error handler; return true if error handled
	 * @param err HttpErrorResponse instance
	 */
	handleHttpError ( err: HttpErrorResponse ) : boolean {
		// first determine if this is a generic HTTP error (i.e. 404, 500, etc)
		let genericError: boolean = this.http.genericModelErrorHandler(err, Model.Item);
		if ( genericError ) return genericError;

		// otherwise, try to handle it
		if ( err.status == 422 ) {
			// not allowed to request this item, either b/c it belongs to you, or you've already requested it
			console.error ( err.error['message'] );
			this.alert.error ( err.error['message'] );
			return true;
		}

		this.alert.error ( "Unexpected error. Please inform the code monkeys behind this project." );
		return false;
	}


	/**
	 * Navigate to the public profile page of the item owner
	 */
	navigateToOwnerProfile () : void {
		let path: Array<string> = ['/user', this.item.user.id.toString()];
		this.router.navigate(path);
	}


	returnToItemDetails () {
		this.router.navigate ([]);
	}

}
